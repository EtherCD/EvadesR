import { World } from ".";
import { sendToCore } from "../../network/ws/send";
import { logger } from "../../services/logger";
import { gameConfig, tile } from "../../shared/config";
import { Player } from "../objects/player";
import { sendToNetwork } from "../send";
import { Area } from "./area";

export class WorldsWarp {
  worlds: Record<string, World>;

  constructor(worlds: Record<string, World>) {
    this.worlds = worlds;
  }

  process(player: Player) {
    const area = this.worlds[player.world].areas[player.area];

    if (player.pos[0] + player.radius > area.w + 8 * tile) {
      const nextArea = this.nextArea(player.world, player.area);
      if (nextArea !== undefined) {
        player.pos[0] = -8 * tile + player.radius + 1;
        this.warp(player, player.world, player.area + 1);
      } else if (area.props.win) {
        sendToNetwork.close(
          player.id,
          "You win! VP reached: " + (area.props.vp ?? 0)
        );
      }
    }

    if (player.area === 0) {
      if (player.pos[0] - player.radius < 0) {
        if (player.pos[1] - player.radius < 2 * tile) {
          const nextWorld = this.nextWorld(player.world);
          player.pos[1] =
            nextWorld.areas[0].h - player.radius - 2 * tile + 1 - 1;
          this.warp(player, nextWorld.name, 0);
        }
        if (player.pos[1] + player.radius > area.h - 2 * tile) {
          const prevWorld = this.prevWorld(player.world);
          player.pos[1] = player.radius + 2 * tile + 1;
          this.warp(player, prevWorld.name, 0);
        }
      }
    } else if (player.pos[0] - player.radius < -8 * tile) {
      const prevArea = this.prevArea(player.world, player.area);
      if (prevArea === undefined) return;
      player.pos[0] = prevArea.w + 8 * tile - player.radius;
      this.warp(player, player.world, player.area - 1);
    }
  }

  nextArea(world: string, area: number): Area | undefined {
    const obj = this.worlds[world].areas[area + 1];
    if (obj) {
      return obj;
    }
  }

  prevArea(world: string, area: number) {
    const obj = this.worlds[world].areas[area - 1];
    if (obj) {
      return obj;
    }
  }

  nextWorld(world: string) {
    const index = gameConfig.worlds.indexOf(world) + 1;
    if (index === gameConfig.worlds.length) {
      return this.worlds[gameConfig.worlds[0]];
    } else {
      return this.worlds[gameConfig.worlds[index]];
    }
  }

  prevWorld(world: string) {
    const index = gameConfig.worlds.indexOf(world) - 1;
    if (index !== 0) {
      return this.worlds[gameConfig.worlds[gameConfig.worlds.length - 1]];
    } else {
      return this.worlds[gameConfig.worlds[0]];
    }
  }

  warp(player: Player, world: string, area: number) {
    this.worlds[player.world].leave(player);
    player.area = area;
    player.world = world;
    this.worlds[world].join(player);

    sendToNetwork.areaInit(player.id, this.worlds[world].packArea(area));
  }
}
