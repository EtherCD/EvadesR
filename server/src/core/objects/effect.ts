import { PlayerEffectProps, Update } from "server/src/shared/core/types";
import { Entity } from "./entity";
import { Player } from "./player";

export abstract class PlayerEffect {
  target: Player;
  caster: Entity;

  constructor(props: PlayerEffectProps) {
    this.target = props.target;
    this.caster = props.caster;
  }

  abstract update(update: Update): void;
  abstract clear(): void;
}
