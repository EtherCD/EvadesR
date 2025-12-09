import { Entity } from "../../core/objects/entity";
import { Player } from "../../core/objects/player";
import { tile } from "../../shared/config";
import { EntityProps, Update } from "../../shared/core/types";
import distance from "../../shared/distance";

export class Sniper extends Entity {
  name = "sniper";
  delay = 3000;
  timer = Math.random() * this.delay;
  bulletSize = this.radius / 2;

  interact(player: Player) {
    super.interact(player);
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

        let bullet = new Bullet({
          count: 1,
          type: "",
          typeId: 4,
          name: "",
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

export class Bullet extends Entity {
  behavior(props: Update): void {}
  auraEffect(player: Player): void {}

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
