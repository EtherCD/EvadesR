import { Entity } from "../../core/objects/entity";
import { Player } from "../../core/objects/player";
import { Area } from "../../core/world/area";
import { EntityProps, PlayerProps, Update } from "../../shared/core/types";

export class Wall extends Entity {
  name = "immune";
  immune = true;
  dirAct = 1;

  constructor(data: EntityProps) {
    super(data);
    let count = data.count;
    let num = data.num;
    if (data.inverse) {
      this.dirAct = -1;
    }

    let angle = 0;

    this.velToAngle();

    let newBound = {
      x: this.radius,
      y: this.radius,
      w: this.area.w - this.radius * 2,
      h: this.area.h - this.radius * 2,
    };

    var peri = (this.perimeter(newBound) / count) * num + this.area.w / 2;
    var posAround = this.warpAround(newBound, peri);

    this.pos[0] = posAround.x ?? 0;
    this.pos[1] = posAround.y ?? 0;

    if (posAround.dir == 0) {
      this.vel[1] = 0;
      this.vel[0] = this.speed * this.dirAct;
    }
    if (posAround.dir == 1) {
      this.vel[0] = 0;
      this.vel[1] = this.speed * this.dirAct;
    }
    if (posAround.dir == 2) {
      this.vel[1] = 0;
      this.vel[0] = -this.speed * this.dirAct;
    }
    if (posAround.dir == 3) {
      this.vel[0] = 0;
      this.vel[1] = -this.speed * this.dirAct;
    }

    this.angle = angle;
    this.immune = true;
  }

  perimeter(area: { w: number; h: number }) {
    return area.w * 2 + area.h * 2;
  }

  warpAround(
    rect: { x: number; y: number; w: number; h: number },
    lengthT: number
  ) {
    let length = lengthT % (rect.w * 2 + rect.h * 2);
    let xpos;
    let ypos;
    let dir;
    if (length < rect.w) {
      dir = 0;
      ypos = rect.y;
      xpos = rect.x + length;
    } else if (length < rect.w + rect.h) {
      dir = 1;
      xpos = rect.x + rect.w;
      ypos = rect.y + (length - rect.w);
    } else if (length < rect.w * 2 + rect.h) {
      dir = 2;
      ypos = rect.y + rect.h;
      xpos = rect.x + rect.w - (length - (rect.w + rect.h));
    } else if (length < rect.w * 2 + rect.h * 2) {
      dir = 3;
      xpos = rect.x;
      ypos = rect.y + rect.h - (length - (rect.w * 2 + rect.h));
    }
    return {
      x: xpos,
      y: ypos,
      dir: dir,
    };
  }
  collide(boundary: { w: number; h: number }): void {
    if (this.pos[0] - this.radius < 0) {
      this.pos[0] = this.radius + 1;
      this.vel[0] = 0;
      this.vel[1] = -this.speed * this.dirAct;
    }
    if (this.pos[0] + this.radius > boundary.w) {
      this.pos[0] = this.area.w - this.radius;
      this.vel[0] = 0;
      this.vel[1] = this.speed * this.dirAct;
    }
    if (this.pos[1] - this.radius < 0) {
      this.pos[1] = this.radius;
      this.vel[0] = this.speed * this.dirAct;
      this.vel[1] = 0;
    }
    if (this.pos[1] + this.radius > boundary.h) {
      this.pos[1] = this.area.h - this.radius;
      this.vel[0] = -this.speed * this.dirAct;
      this.vel[1] = 0;
    }
    super.collide(boundary);
  }

  behavior(props: Update): void {}
  auraEffect(player: Player): void {}
}
