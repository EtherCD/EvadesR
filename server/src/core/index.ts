import { WebSocket } from "uWebSockets.js";
import { Maven } from "../assets/hero/maven";
import { coreEvents } from "../services/events/core";
import { Loader } from "../services/loader";
import { diff } from "../shared/diff";
import { Player } from "./objects/player";
import { sendToNetwork } from "./send";
import { World } from "./world";
import { Client } from "../network/ws";
import { WorldsWarp } from "./world/warp";
import { ChatMessage, PackedPlayer } from "@shared/types";

export class Game {
  worlds: Record<string, World> = Loader.loadWorlds();
  players: Record<number, Player> = {};
  oldPlayersPack: Record<number, PackedPlayer> = {};
  worldsWarp: WorldsWarp = new WorldsWarp(this.worlds);

  constructor() {
    coreEvents.on("join", (props) => {
      const player = new Maven(props);
      this.players[props.id] = player;
      this.worlds[player.world].join(player);
      sendToNetwork.newPlayer(player.pack());

      let a: Record<number, PackedPlayer> = {};
      for (const i in this.players) {
        a[i] = this.players[i].pack();
      }

      sendToNetwork.self(props.id, player.pack());
      sendToNetwork.players(props.id, a);
      sendToNetwork.areaInit(
        props.id,
        this.worlds[player.world].packArea(player.area)
      );
    });
    coreEvents.on("leave", ({ id, reason }) => {
      try {
        const player = this.players[id];
        sendToNetwork.closePlayer(id);
        this.worlds[player.world].leave(player);
        delete this.players[id];
        sendToNetwork.close(id, reason ?? "");
      } catch {}
    });
    coreEvents.on("message", ({ msg, id }) => {
      const player = this.players[id];
      const out: ChatMessage = {
        author: player.name,
        msg,
        role: player.role + "",
        world: player.world,
      };
      sendToNetwork.message(out);
    });
    coreEvents.on("newEntity", ({ world, area, ent }) => {
      this.worlds[world].areas[area].addEntity(ent);
    });
  }

  lastUpdateTime = Date.now();

  update(map: Map<number, WebSocket<Client>>) {
    const time = Date.now();
    const delta = time - this.lastUpdateTime;
    const timeFix = delta / (1000 / 30);
    this.lastUpdateTime = time;

    const obj = {
      delta,
      timeFix,
      players: this.players,
    };

    this.createDiff();

    for (const w in this.worlds) {
      this.worlds[w].update(obj);
      this.worlds[w].interact(this.players);
    }

    for (const p in this.players) {
      const player = this.players[p];

      const area = this.worlds[player.world].areas[player.area];
      const updatePlayer = {
        ...obj,
        area,
        players: area.getPlayers(this.players),
      };

      if (this.isPlayerClose(player)) continue;
      player.input(map.get(Number(p))!.getUserData().input);
      player.update(updatePlayer);
      player.collide(this.worlds[player.world].areas[player.area]);
      this.worldsWarp.process(player);
    }
    const dif = this.getDiff();
    if (dif !== null) sendToNetwork.updatePlayers(dif);
  }

  createDiff() {
    this.oldPlayersPack = {};
    for (const i in this.players) {
      this.oldPlayersPack[i] = Object.assign({}, this.players[i].pack());
    }
  }

  isPlayerClose(player: Player) {
    if (player === undefined) return true;
    if (player.dTimer <= 0) {
      sendToNetwork.close(player.id, "You died");
      sendToNetwork.closePlayer(player.id);
      this.worlds[player.world].leave(player);
      delete this.players[player.id];
      return true;
    }
    return false;
  }

  getDiff() {
    let updatedPlayers: Record<number, Partial<PackedPlayer>> | null = null;
    const keys = Object.keys(this.players);
    for (const v of keys) {
      const i = v as any as number;
      const dif = diff(this.oldPlayersPack[i], this.players[i].pack());
      if (dif[1]) {
        if (updatedPlayers === null) updatedPlayers = {};
        updatedPlayers[i] = dif[0];
      }
    }
    return updatedPlayers;
  }
}
