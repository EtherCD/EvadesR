import { sendToCore } from "server/src/core/send";
import { Ability } from "../../core/objects/ability";
import { EntityProps, Update, UpdatePlayer } from "../../shared/core/types";
import distance from "../../shared/distance";
import { Entity } from "server/src/core/objects/entity";
import { Player } from "server/src/core/objects/player";
import { entityNames } from "server/src/shared/core/spawn";

export class MagneticSoulAbility extends Ability {
  consumeEnergy: number = 30;
  aura: number = 180;

  update(update: UpdatePlayer): void {
    if (this.caster.downed && this.active) {
      sendToCore.addEntity(
        new Soul({
          count: 1,
          type: "",
          name: "",
          num: 1,
          typeId: entityNames.indexOf("soul"),
          x: this.caster.pos[0],
          y: this.caster.pos[1],
          radius: this.caster.radius,
          area: update.area,
          speed: 0,
          caster: this.caster,
        }),
        this.caster.world,
        this.caster.area
      );
      this.active = false;
    }
  }

  activate(): void {
    this.caster.state = 2;
    if (this.caster.downed && !this.activate) this.active = true;
  }
  deactivate(): void {
    this.active = false;
  }
  noEnergy(): void {
    this.active = false;
  }
}

export class Soul extends Entity {
  casterPos: number[];
  caster: Player;
  maxDistance = 120;

  speed = 5;
  timeout = 6000;

  constructor(props: EntityProps & { caster: Player }) {
    super(props);
    this.caster = props.caster;

    this.casterPos = [this.pos[0], this.pos[1]];

    this.harmless = true;
  }

  behavior(props: Update): void {
    this.timeout -= props.delta;
    if (this.timeout <= 0) {
      this.toRemove = true;
      return;
    }

    let target: Player | null = null;
    let bestDist = this.maxDistance;

    for (const i in props.players) {
      const p = props.players[i];

      const d = distance(this.pos[0], this.pos[1], p.pos[0], p.pos[1]);

      if (d < bestDist && p.id !== this.caster.id) {
        bestDist = d;
        target = p;
      }
    }

    if (!target) {
      this.moveBackToOrigin();
      return;
    }

    const ang = Math.atan2(
      target.pos[1] - this.pos[1],
      target.pos[0] - this.pos[0]
    );

    let vx = Math.cos(ang) * this.speed;
    let vy = Math.sin(ang) * this.speed;

    const nextX = this.pos[0] + vx;
    const nextY = this.pos[1] + vy;

    const distFromOrigin = distance(
      this.casterPos[0],
      this.casterPos[1],
      nextX,
      nextY
    );

    if (distFromOrigin > this.maxDistance) {
      this.moveBackToOrigin();
      return;
    }

    this.vel[0] = vx;
    this.vel[1] = vy;
  }

  moveBackToOrigin() {
    const dist = distance(
      this.pos[0],
      this.pos[1],
      this.casterPos[0],
      this.casterPos[1]
    );

    if (dist < 1) {
      this.vel[0] = 0;
      this.vel[1] = 0;
      return;
    }

    const ang = Math.atan2(
      this.casterPos[1] - this.pos[1],
      this.casterPos[0] - this.pos[0]
    );

    this.vel[0] = Math.cos(ang) * this.speed;
    this.vel[1] = Math.sin(ang) * this.speed;
  }

  auraEffect(player: Player): void {}

  interact(player: Player): void {
    if (!player.downed) {
      const d = distance(
        player.pos[0],
        player.pos[1],
        this.pos[0],
        this.pos[1]
      );
      if (d <= this.radius + player.radius) {
        this.caster.res();
        this.toRemove = true;
      }
    }
  }

  collide(_: { w: number; h: number }): void {}
}
