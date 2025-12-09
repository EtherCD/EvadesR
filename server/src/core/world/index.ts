import { PartialUpdate, Update } from "../../shared/core/types";
import distance from "../../shared/distance";
import { RawWorld } from "../../shared/services/types";
import { Player } from "../objects/player";
import { Area } from "./area";

export class World {
  areas: Area[];
  name: string;

  constructor(props: RawWorld) {
    this.name = props.name;
    this.areas = props.areas.map(
      (v, id) =>
        new Area({
          ...v,
          id,
        })
    );
  }

  update(props: PartialUpdate) {
    for (const area in this.areas) this.areas[area].update(props);
  }

  join(player: Player) {
    this.areas[player.area].join(player);
  }

  leave(player: Player) {
    this.areas[player.area].leave(player);
  }

  interact(players: Record<number, Player>) {
    for (const area of this.areas) {
      Object.values(area.entities).forEach((v) => {
        Object.keys(area.getPlayers(players)).forEach((o) => {
          const player = players[Number(o)];
          if (
            player.pos[0] + player.radius > 9 &&
            player.pos[0] - player.radius < area.w
          )
            v.interact(players[Number(o)]);
        });
      });

      const ids = area.players;
      for (const first of ids) {
        for (const second of ids) {
          const firstPlayer = players[first];
          const secondPlayer = players[second];
          if (
            !firstPlayer.downed &&
            secondPlayer.downed &&
            distance(
              firstPlayer.pos[0],
              firstPlayer.pos[1],
              secondPlayer.pos[0],
              secondPlayer.pos[1]
            ) <=
              firstPlayer.radius + secondPlayer.radius
          ) {
            secondPlayer.res();
          }
        }
      }
    }
  }

  packArea(area: number) {
    const value = this.areas[area];
    return {
      w: value.w,
      h: value.h,
      area,
      entities: value.getEnemies(),
      world: this.name,
    };
  }
}
