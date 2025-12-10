import { entityNames } from "server/src/shared/core/spawn";
import { Entity } from "../../core/objects/entity";
import { Player } from "../../core/objects/player";
import { tile } from "../../shared/config";
import { EntityProps, Update } from "../../shared/core/types";
import distance from "../../shared/distance";

export class HomingSniper extends Entity {
  name = "homingsniper";
  delay = 3000;
  timer = Math.random() * this.delay;
  bulletSize = this.radius / 2;

  interact(player: Player) {
    super.interact(player);

    if (
      player.pos[0] > -player.radius &&
      player.pos[0] - player.radius < this.area.w
    )
      if (this.timer > this.delay && !player.downed) {
        let target;
        if (
          distance(player.pos[0], player.pos[1], this.pos[0], this.pos[1]) <=
          20 * tile
        ) {
          target = player;
        }

        if (target) {
          let angl = Math.atan2(
            target.pos[1] - this.pos[1],
            target.pos[0] - this.pos[0]
          );

          let bullet = new HomingBullet({
            count: 1,
            type: "",
            typeId: entityNames.indexOf("homing_bullet"),
            num: 1,
            x: this.pos[0],
            y: this.pos[1],
            radius: this.bulletSize,
            speed: 10,
            area: this.area,
          });
          bullet.vel[0] = Math.cos(angl) * bullet.speed;
          bullet.vel[1] = Math.sin(angl) * bullet.speed;

          this.area.addEntity(bullet);

          this.timer = 0;
        }
      }
  }

  behavior(props: Update): void {
    this.timer += props.delta;
  }

  auraEffect(player: Player): void {}
}

export class HomingBullet extends Entity {
  auraEffect(player: Player): void {}

  targetAngle: number = this.angle;
  maxDistance = 5.625 * 32;

  interact(player: Player): void {
    if (!player.downed) {
      if (
        distance(player.pos[0], player.pos[1], this.pos[0], this.pos[1]) <=
        this.radius + player.radius
      ) {
        player.knock();
        this.toRemove = true;
      }
    }
  }

  behavior(data: Update) {
    let lastDistance = this.maxDistance;
    let target: Player | null = null;
    this.targetAngle = this.angle;

    for (const i in data.players) {
      const player = data.players[i];
      if (player.pos[0] > 0 && player.pos[0] < this.area.w && !player.downed) {
        const dist = distance(
          this.pos[0],
          this.pos[1],
          player.pos[0],
          player.pos[1]
        );
        if (dist <= this.maxDistance && dist < lastDistance) {
          target = player;
          lastDistance = dist;
        }
      }
    }
    if (target !== null) {
      const dX = target.pos[0] - this.pos[0];
      const dY = target.pos[1] - this.pos[1];
      this.targetAngle = Math.atan2(dY, dX);

      const dif = this.targetAngle - this.angle;
      const angleDif = Math.atan2(Math.sin(dif), Math.cos(dif));
      const angleIncrement = 0.04;

      this.velToAngle();
      if (Math.abs(angleDif) >= angleIncrement) {
        if (angleDif < 0) {
          this.angle -= angleIncrement * (data.delta / 30);
        } else {
          this.angle += angleIncrement * (data.delta / 30);
        }
        this.angleToVel();
      }
    }
  }

  collide(boundary: { w: number; h: number }): void {
    if (this.pos[0] - this.radius < 0) {
      this.toRemove = true;
    }
    if (this.pos[0] + this.radius > boundary.w) {
      this.toRemove = true;
    }
    if (this.pos[1] - this.radius < 0) {
      this.toRemove = true;
    }
    if (this.pos[1] + this.radius > boundary.h) {
      this.toRemove = true;
    }
  }
}
