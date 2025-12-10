import { Entity } from "server/src/core/objects/entity";
import { Player } from "server/src/core/objects/player";
import { Update } from "server/src/shared/core/types";
import distance from "server/src/shared/distance";

export class Bee extends Entity {
  maxDistance = 5.625 * 32;
  rotationSpeed: number = 0.04;
  currentTarget: Player | null = null;
  lockTime: number = 0;

  behavior(data: Update) {
    let closestDistance = this.maxDistance;
    let newTarget: Player | null = null;

    for (const i in data.players) {
      const player = data.players[i];
      if (player.pos[0] > 0 && player.pos[0] < this.area.w && !player.downed) {
        const dist = distance(
          this.pos[0],
          this.pos[1],
          player.pos[0],
          player.pos[1]
        );

        if (dist <= this.maxDistance && dist < closestDistance) {
          closestDistance = dist;
          newTarget = player;
        }
      }
    }

    if (newTarget !== null) {
      if (
        this.currentTarget === null ||
        distance(
          this.pos[0],
          this.pos[1],
          this.currentTarget.pos[0],
          this.currentTarget.pos[1]
        ) >
          closestDistance + 50
      ) {
        this.currentTarget = newTarget;
        this.lockTime = 60;
      }
    }

    if (this.currentTarget !== null && this.lockTime > 0) {
      this.lockTime -= 1;

      const dX = this.currentTarget.pos[0] - this.pos[0];
      const dY = this.currentTarget.pos[1] - this.pos[1];
      const targetAngle = Math.atan2(dY, dX);

      this.velToAngle();

      let angleDiff = targetAngle - this.angle;

      if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

      const maxTurn = this.rotationSpeed * (data.delta / 16.67);
      if (Math.abs(angleDiff) < maxTurn) {
        this.angle = targetAngle;
      } else {
        this.angle += Math.sign(angleDiff) * maxTurn;
      }

      this.angleToVel();
    } else {
      this.currentTarget = null;
    }
  }

  auraEffect(player: Player): void {}
}
