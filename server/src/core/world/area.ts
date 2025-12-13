import { PackedEntity } from "shared/types";
import { tile } from "../../shared/config";
import { EntityProps, PartialUpdate, Update } from "../../shared/core/types";
import { diff } from "../../shared/diff";
import { RawArea, RawEntity } from "../../shared/services/types";
import { Entity } from "../objects/entity";
import { Player } from "../objects/player";
import { sendToDB, sendToNetwork } from "../send";
import { SpawnFactory } from "../../shared/core/spawn";
import { randomBytes } from "crypto";

export class Area {
  entities: Record<number, Entity> = {};
  oldEntitiesPacks: Record<number, PackedEntity> = {};
  nextId = 0;
  w: number;
  h: number;
  players: number[] = [];
  awardId: string = "";

  id = 0;
  props: RawArea;

  constructor(props: RawArea) {
    this.w = props.w * tile;
    this.h = props.h * tile;
    this.props = props;
    this.id = props.id;
    if (this.props.vp) this.awardId = randomBytes(10).join("");
  }

  join(player: Player) {
    if (this.players.length === 0) {
      this.init();
    }
    if (this.props.win)
      if (!player.addAward(this.awardId)) {
        sendToDB.award({
          username: player.name,
          vp: this.props.vp ?? 0,
        });
      }
    this.players.push(player.id);
  }

  leave(player: Player) {
    this.players = this.players.filter((v) => v !== player.id);
    if (this.players.length === 0) {
      this.deInit();
    }
  }

  spawnEntity(val: EntityProps, additional: unknown) {
    this.entities[this.nextId++] = SpawnFactory.entity({
      ...val,
      area: this,
      typeId: 0,
      inverse: false,
    });
  }

  init() {
    if (!this.props.enemies) return;
    this.nextId = 0;
    for (let i = 0; i < this.props.enemies.length; i++) {
      for (let l = 0; l < this.props.enemies[i].count; l++) {
        const val = this.props.enemies[i];
        const type = val.types[Math.floor(Math.random() * val.types.length)];
        this.entities[this.nextId++] = SpawnFactory.entity({
          ...val,
          area: this,
          typeId: 0,
          type: type,
          num: l,
          count: this.props.enemies[i].count,
          inverse: false,
        });
      }
    }

    this.oldEntitiesPacks = Object.assign({}, this.getEnemies());
  }

  private deInit() {
    this.entities = [];
  }

  update(update: PartialUpdate) {
    this.oldEntitiesPacks = Object.assign({}, this.getEnemies());

    const upd = {
      ...update,
      area: this,
      players: this.getPlayers(update.players),
    };

    for (const e in this.entities) {
      this.entities[e].update(upd);
      if (this.entities[e].toRemove) {
        sendToNetwork.closeEntities(this.players, Number(e));
        delete this.entities[e];
      }
    }

    const updatedEntities = this.getDiffEnemies();
    if (updatedEntities[0])
      for (const i of this.players)
        sendToNetwork.updateEntities(i, updatedEntities[0]);
  }

  addEntity = (entity: Entity) => {
    this.nextId++;
    this.entities[this.nextId] = entity;
    sendToNetwork.newEntities(this.players, this.nextId, entity.pack());
  };

  getDiffEnemies(): [
    Record<number, Partial<PackedEntity>> | undefined,
    boolean
  ] {
    let updated: Record<number, Partial<PackedEntity>> | undefined;
    const keys = Object.keys(this.entities);
    let isUpdated = false;
    for (const v of keys) {
      const i = v as any as number;
      const dif = diff(this.oldEntitiesPacks[i], this.entities[i].pack());
      if (dif[1]) {
        if (updated === undefined) updated = {};
        updated[i] = dif[0];
        isUpdated = true;
      }
    }
    return [updated, isUpdated];
  }

  getEnemies(): Record<number, PackedEntity> {
    let res: Record<number, PackedEntity> = {};

    for (const i in this.entities) res[i] = this.entities[i].pack();

    return res;
  }

  getPlayers(players: Record<number, Player>) {
    let output: Record<number, Player> = {};

    for (const i of this.players) {
      output[i] = players[i];
    }

    return output;
  }
}
