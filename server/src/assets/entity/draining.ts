import { PlayerEffect } from "server/src/core/objects/effect";
import { Entity } from "../../core/objects/entity";
import { Player } from "../../core/objects/player";
import {
  EntityProps,
  PlayerEffectProps,
  Update,
} from "../../shared/core/types";
import distance from "server/src/shared/distance";

const effectId = 2;

export class Draining extends Entity {
  aura = 0;

  constructor(props: EntityProps) {
    super(props);
    this.aura = props.aura ?? 150;
    this.state = 1;
    this.stateMetadata = this.aura;
  }

  behavior(props: Update): void {}
  auraEffect(player: Player): void {
    if (!player.hasEffect(effectId))
      player.addEffect(
        effectId,
        new DrainingEffect({
          target: player,
          caster: this,
          aura: this.aura!,
        })
      );
  }
}

export class DrainingEffect extends PlayerEffect {
  aura: number;

  constructor(props: PlayerEffectProps & { aura: number }) {
    super(props);
    this.aura = props.aura;
  }

  update(update: Update): void {
    if (
      distance(
        this.caster.pos[0],
        this.caster.pos[1],
        this.target.pos[0],
        this.target.pos[1]
      ) <=
      this.aura + this.target.radius
    ) {
      this.target.consumeEnergy(16, update.delta);
    } else this.clear();
  }

  clear(): void {
    this.target.removeEffect(effectId);
  }
}
