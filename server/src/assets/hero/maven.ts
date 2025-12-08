import { Ability } from "../../core/objects/ability";
import { Player } from "../../core/objects/player";
import { PlayerProps } from "../../shared/core/types";
import { LifebuoyAbility } from "../ability/lifebuoy";

export class Maven extends Player {
  firstAbility: LifebuoyAbility;
  secondAbility: LifebuoyAbility;

  constructor(props: PlayerProps) {
    super(props);
    this.firstAbility = new LifebuoyAbility(this);
    this.secondAbility = new LifebuoyAbility(this);
  }
}
