import { Entity } from "server/src/core/objects/entity";
import { Player } from "server/src/core/objects/player";
import { tile } from "server/src/shared/config";
import { Update } from "server/src/shared/core/types";
import distance from "server/src/shared/distance";
import { Trail } from "./flame";
import { entityNames } from "server/src/shared/core/spawn";

export class FlameSniper extends Entity {
  delay = 3000;
  timer = Math.random() * this.delay;
  bulletSize = this.radius / 2;

  light = true;

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

          let bullet = new Flame({
            count: 1,
            type: "",
            typeId: entityNames.indexOf("trail"),
            num: 1,
            x: this.pos[0],
            y: this.pos[1],
            radius: this.bulletSize,
            speed: 10,
            area: this.area,
          });
          console.log(bullet);
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

class Flame extends Entity {
  timer = 0;

  light = true;

  behavior({ delta }: Update): void {
    this.timer += delta;
    if (this.timer >= 32.5 * ((this.radius * 2) / this.speed)) {
      const trail = new Trail({
        x: this.pos[0],
        y: this.pos[1],
        radius: this.radius,
        speed: 0,
        area: this.area,
        ownerSpeed: this.speed,
        type: "",
        typeId: entityNames.indexOf("trail"),
        count: 0,
        num: 0,
      });

      this.area.addEntity(trail);

      this.timer = 0;
    }
  }
  auraEffect(player: Player): void {}

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
