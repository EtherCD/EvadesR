import { Entity } from "server/src/core/objects/entity";
import { Player } from "server/src/core/objects/player";
import { Update } from "server/src/shared/core/types";
import distance from "server/src/shared/distance";

export class Cloud extends Entity {
  alpha = 0.4;

  gravity = 3;

  behavior(props: Update): void {
    for (const i in props.players) {
      const player = props.players[i];
      if (!player.immortal) {
        if (
          player.pos[0] > -player.radius &&
          player.pos[0] - player.radius < this.area.w
        )
          if (
            distance(player.pos[0], player.pos[1], this.pos[0], this.pos[1]) <=
            this.radius + player.radius
          ) {
            let dx = player.pos[0] - this.pos[0];
            let dy = player.pos[1] - this.pos[1];
            let dist = distance(
              player.pos[0],
              player.pos[1],
              this.pos[0],
              this.pos[1]
            );
            let attractAmplitude = Math.pow(2, -(dist / 120));
            let moveDist = this.gravity * attractAmplitude;
            let angle = Math.atan2(dy, dx);
            let timeFix = props.timeFix;
            player.pos[0] += moveDist * Math.cos(angle) * timeFix;
            player.pos[1] += moveDist * Math.sin(angle) * timeFix;
          }
      }
    }
  }

  auraEffect(player: Player): void {}

  interact(player: Player): void {}
}
