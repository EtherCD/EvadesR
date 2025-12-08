import { Entity } from "../../core/objects/entity";
import { Player } from "../../core/objects/player";
import { Update } from "../../shared/core/types";

export class Immune extends Entity {
  name = "immune";
  type = 1;
  immune = true;
  behavior(props: Update): void {}
  auraEffect(player: Player): void {}
}
