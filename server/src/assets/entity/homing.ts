import { Entity } from "server/src/core/objects/entity";
import { Player } from "server/src/core/objects/player";
import { Update } from "server/src/shared/core/types";
import distance from "server/src/shared/distance";

export class Homing extends Entity {
  targetAngle: number = this.angle;
  maxDistance = 5.625 * 32;

  behavior(data: Update) {
    let lastDistance = this.maxDistance;
    let target: Player | null = null;
    this.targetAngle = this.angle;

    for (const i in data.players) {
      const player = data.players[i];

      if (
        player.pos[0] > -player.radius &&
        player.pos[0] - player.radius < this.area.w
      )
        if (!player.downed) {
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
  auraEffect(player: Player): void {}
}
