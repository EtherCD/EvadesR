import distance from "../../shared/distance";
import { EntityProps, Update } from "../../shared/core/types";
import { random } from "../../shared/random";
import { Player } from "./player";
import { Area } from "../world/area";
import { PackedEntity } from "@shared/types";

export abstract class Entity {
  type: number;
  name: string;
  radius: number;
  aura?: number;
  speed: number;
  harmless: boolean;
  immune: boolean;
  angle: number;
  pos: number[];
  vel: number[];
  area: Area;
  toRemove: boolean;
  friction: number;

  state = 0;
  stateMetadata = 0;

  constructor(data: EntityProps) {
    this.type = 0;
    this.name = "normal";
    this.radius = data.radius;
    this.speed = data.speed;
    this.harmless = false;
    this.immune = data.immune ?? false;
    this.area = data.area;
    this.pos = [
      random(this.radius, this.area.w - this.radius),
      random(this.radius, this.area.h - this.radius),
    ];
    this.angle = Math.random();
    this.vel = [
      Math.cos(this.angle * Math.PI * 2) * data.speed,
      Math.sin(this.angle * Math.PI * 2) * data.speed,
    ];

    let mx = this.pos[0],
      my = this.pos[1];

    let w = this.area.w;
    let h = this.area.h;

    if (data.x) {
      if (typeof data.x == "string") {
        if (data.x.endsWith("t")) {
          mx = Number(data.x.slice(0, -1)) * 32 - 15;
        } else if (data.x.endsWith("tn")) {
          mx = w - Number(data.x.slice(0, -2)) * 32 + 15;
        } else mx = eval(data.x);
      } else {
        mx = data.x;
      }
    }
    if (data.y) {
      if (typeof data.y == "string") {
        if (data.y.endsWith("t")) {
          my = Number(data.y.slice(0, -1)) * 32 - 15;
        } else if (data.y.endsWith("tn")) {
          my = h - Number(data.y.slice(0, -2)) * 32 + 15;
        } else {
          my = eval(data.y);
        }
      } else {
        my = data.y;
      }
    }

    this.pos[0] = mx;
    this.pos[1] = my;

    this.toRemove = false;
    this.friction = 0;
  }

  update(props: Update) {
    const { timeFix, delta } = props;
    this.harmless = false;
    this.behavior(props);
    this.move(timeFix);
    this.collide(this.area);
  }

  abstract behavior(props: Update): void;
  abstract auraEffect(player: Player): void;

  move(timeFix: number) {
    let vel = [this.vel[0], this.vel[1]];

    this.pos[0] += vel[0] * timeFix;
    this.pos[1] += vel[1] * timeFix;

    let dim = 1 - this.friction * timeFix;
    this.vel[0] *= dim;
    this.vel[1] *= dim;
  }

  angleToVel(ang = this.angle) {
    this.vel[0] = Math.cos(ang) * this.speed;
    this.vel[1] = Math.sin(ang) * this.speed;
  }

  velToAngle() {
    this.angle = Math.atan2(this.vel[1], this.vel[0]);
    var dist = distance(0, 0, this.vel[0], this.vel[1]);
    this.speed = dist;
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
      this.pos[1] = boundary.h - this.radius;
      this.vel[1] = -Math.abs(this.vel[1]);
    }
  }

  interact(player: Player) {
    if (!player.immortal && !player.downed) {
      if (
        distance(player.pos[0], player.pos[1], this.pos[0], this.pos[1]) <=
          this.radius + player.radius &&
        !this.harmless
      ) {
        player.knock();
      }
      if (this.aura != undefined && this.aura > 0) {
        if (
          distance(player.pos[0], player.pos[1], this.pos[0], this.pos[1]) <=
          this.aura + player.radius
        ) {
          this.auraEffect(player);
        }
      }
    }
  }

  pack(): PackedEntity {
    return {
      type: this.type,
      x: Math.round(this.pos[0] * 10) / 10,
      y: Math.round(this.pos[1] * 10) / 10,
      aura: this.aura,
      radius: this.radius < 0 ? 0 : this.radius,
      harmless: this.harmless,
      state: this.state,
      stateMetadata: this.stateMetadata,
    };
  }
}
