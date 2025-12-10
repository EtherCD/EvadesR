import { Player } from "../../core/objects/player";
import { PlayerProps } from "../../shared/core/types";
import { LifebuoyAbility } from "../ability/lifebuoy";
import { MagneticSoulAbility } from "../ability/magneticsoul";

export class Maven extends Player {
  firstAbility: LifebuoyAbility;
  secondAbility: MagneticSoulAbility;

  constructor(props: PlayerProps) {
    super(props);
    this.firstAbility = new LifebuoyAbility(this);
    this.secondAbility = new MagneticSoulAbility(this);
  }

  res(): void {
    super.res();

    this.secondAbility.deactivate();
  }
}
