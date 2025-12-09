import { Entity } from "../../core/objects/entity";
import { Player } from "../../core/objects/player";
import { tile } from "../../shared/config";
import { EntityProps, Update } from "../../shared/core/types";
import distance from "../../shared/distance";

export class Corrosive extends Entity {
  name = "corrosive";

  behavior({ delta }: Update) {}

  auraEffect(player: Player): void {}

  interact(player: Player): void {
    if (
      distance(player.pos[0], player.pos[1], this.pos[0], this.pos[1]) <=
        this.radius + player.radius &&
      !player.downed &&
      !this.harmless
    ) {
      player.knock();
    }
  }
}
