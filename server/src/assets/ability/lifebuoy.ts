import { Ability } from "../../core/objects/ability";
import { Player } from "../../core/objects/player";
import { Update, UpdatePlayer } from "../../shared/core/types";
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
    this.active = !this.active;
  }
  deactivate(): void {
    this.active = false;
  }
  noEnergy(): void {
    this.active = false;
  }
}
