import { PlayerEffect } from "server/src/core/objects/effect";
import { Entity } from "server/src/core/objects/entity";
import { Player } from "server/src/core/objects/player";
import {
  EntityProps,
  PlayerEffectProps,
  Update,
} from "server/src/shared/core/types";
import distance from "server/src/shared/distance";
import { random } from "server/src/shared/random";

export class Leaf extends Entity {
  timeSpawn = 1000;
  removeTime = 500;
  remove = false;
  startRadius = 0;

  constructor(data: EntityProps) {
    super(data);
    this.harmless = true;
    this.vel = [0, 0];
    this.startRadius = this.radius;
  }

  behavior({ delta }: Update): void {
    if (this.timeSpawn > 0) {
      this.timeSpawn -= delta;
      this.radius = this.startRadius * 2 * Math.max(0.5, this.timeSpawn / 1000);
      this.alpha = 1 - this.timeSpawn / 1000;
    } else if (this.timeSpawn <= 0 && this.harmless) {
      this.harmless = false;
      this.radius = this.startRadius;
      this.timeSpawn = 0;
    }
    if (this.remove) {
      this.removeTime -= delta;
      this.harmless = true;
      this.alpha = this.removeTime / 500;
      this.radius =
        this.startRadius * 2 * Math.max(0.5, 1 - this.removeTime / 500);
      if (this.removeTime < 0) {
        this.reSpawn();
      }
    }
  }

  reSpawn() {
    this.pos = [
      random(this.radius, this.area.w - this.radius),
      random(this.radius, this.area.h - this.radius),
    ];
    this.timeSpawn = 1000;
    this.removeTime = 500;
    this.remove = false;
  }

  interact(player: Player): void {
    if (!player.immortal && !player.downed) {
      if (
        distance(player.pos[0], player.pos[1], this.pos[0], this.pos[1]) <=
          this.radius + player.radius &&
        !this.harmless
      ) {
        this.remove = true;
        player.addEffect(
          effectId,
          new LeafEffect({
            target: player,
            caster: this,
          })
        );
      }
    }
  }

  auraEffect(player: Player): void {}
}

const effectId = 4;

export class LeafEffect extends PlayerEffect {
  effectTime = 100;
  originalSpeed = 0;
  currentSpeed = 0;

  constructor(props: PlayerEffectProps) {
    super(props);
    this.originalSpeed = props.target.speed + 0;
    this.target.speed = this.originalSpeed * 2;
  }

  update(update: Update): void {
    this.effectTime -= update.delta;
    if (this.effectTime < 0) this.clear();
  }

  clear(): void {
    this.target.speed = this.originalSpeed;
    this.target.removeEffect(effectId);
  }
}
