import { PackedAbility, Update, UpdatePlayer } from "../../shared/core/types";
import { Player } from "./player";

export abstract class Ability {
  level = 0;
  maxLevel = 5;
  consumeEnergy = 0;
  active = false;
  caster: Player;

  constructor(caster: Player) {
    this.caster = caster;
  }

  abstract activate(): void;
  abstract deactivate(): void;
  abstract noEnergy(): void;
  abstract update(update: UpdatePlayer): void;

  upgrade() {
    if (this.level < this.maxLevel) {
      this.level++;
    }
  }

  pack(): PackedAbility {
    return {
      level: this.level,
      maxLevel: this.maxLevel,
      active: this.active,
    };
  }
}
