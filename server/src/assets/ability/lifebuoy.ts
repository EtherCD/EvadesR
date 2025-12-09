import { Ability } from "../../core/objects/ability";
import { UpdatePlayer } from "../../shared/core/types";
import distance from "../../shared/distance";

export class LifebuoyAbility extends Ability {
  consumeEnergy: number = 30;
  aura: number = 180;

  update(update: UpdatePlayer): void {
    if (this.active && !this.caster.downed) {
      this.caster.energy -= this.consumeEnergy * (update.delta / 1000);
      for (const i in update.players) {
        const player = update.players[i];

        if (
          player.downed &&
          distance(
            player.pos[0],
            player.pos[1],
            this.caster.pos[0],
            this.caster.pos[1]
          ) <= this.aura
        ) {
          player.pos[0] = this.caster.pos[0];
          player.pos[1] = this.caster.pos[1];
        }
      }
    }
  }

  activate(): void {
    this.caster.state = 1;
    this.active = this.caster.downed ? false : !this.active;
    if (this.active) {
    } else {
      this.deactivate();
    }
  }
  deactivate(): void {
    this.active = false;
    this.caster.state = 0;
  }
  noEnergy(): void {
    this.active = false;
    this.caster.state = 0;
  }
}
