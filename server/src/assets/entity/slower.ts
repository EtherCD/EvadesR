import { Entity } from "../../core/objects/entity";
import { Player } from "../../core/objects/player";
import { EntityProps, Update } from "../../shared/core/types";

export class Pull extends Entity {
  type = 4;

  constructor(props: EntityProps) {
    super(props);
  }

  behavior(props: Update): void {}
  auraEffect(player: Player): void {}
}
