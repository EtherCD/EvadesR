import { Entity } from "server/src/core/objects/entity";
import { Player } from "server/src/core/objects/player";
import { EntityProps, Update } from "server/src/shared/core/types";
import { random } from "server/src/shared/random";

export class Drop extends Entity {
  timeAtSomeSurface = 0;
  speedTime = 500;
  startTime = 0;
  spawned = true;

  constructor(data: EntityProps) {
    super(data);

    this.vel = [0, this.speed];

    this.timeAtSomeSurface = 0;
    this.startTime = 0;

    this.spawned = true;

    this.alpha = 1;
  }

  behavior({ delta }: Update): void {
    if (this.timeAtSomeSurface > 0) {
      this.timeAtSomeSurface -= delta;
      this.vel[1] = 0;
      this.alpha = 1 - this.timeAtSomeSurface / this.startTime;
      this.harmless = true;
      if (this.timeAtSomeSurface <= 0) {
        this.timeAtSomeSurface = 0;
        this.harmless = false;
        this.vel[1] = this.speed;
        this.speedTime = 500;
      }
    } else if (this.timeAtSomeSurface < 0) {
      this.vel[1] = 0;
      this.alpha = -this.timeAtSomeSurface / this.startTime;
      this.timeAtSomeSurface += delta;
      if (this.timeAtSomeSurface >= 0) this.reSpawn();
    } else {
      this.speedTime -= delta;
      if (this.spawned) this.vel[1] = this.speed;
      else
        this.vel[1] =
          this.speed * (this.speedTime > 0 ? 1 - this.speedTime / 500 : 1);
    }
  }

  collide(boundary: { w: number; h: number }) {
    if (this.pos[0] - this.radius < 0) {
      this.pos[0] = this.radius;
      this.vel[0] = Math.abs(this.vel[0]);
    }
    if (this.pos[0] + this.radius > boundary.w) {
      this.pos[0] = boundary.w - this.radius;
      this.vel[0] = -Math.abs(this.vel[0]);
    }
    if (this.pos[1] - this.radius < 0) {
      this.pos[1] = this.radius;
      this.vel[1] = Math.abs(this.vel[1]);
    }
    if (this.pos[1] + this.radius > boundary.h) {
      this.timeAtSomeSurface = -1000;
      this.startTime = 1000;
      this.spawned = false;
      this.vel[1] = 0;
      this.pos[1] -= 1;
    }
  }

  auraEffect(player: Player): void {}

  reSpawn() {
    this.pos[0] = random(this.radius, this.area.w - this.radius);
    this.pos[1] = this.radius + 1;
    this.vel = [0, 0];
    this.timeAtSomeSurface = random(1000, 2000);
    this.startTime = this.timeAtSomeSurface + 0;
    this.harmless = true;
  }
}
