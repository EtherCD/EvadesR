import { random } from "../../shared/random";
import { gameConfig, tile } from "../../shared/config";
import { PlayerProps, UpdatePlayer } from "../../shared/core/types";
import distance from "../../shared/distance";
import { Input } from "../../shared/ws/types";
import { Ability } from "./ability";
import { AccountRole, PackedPlayer } from "shared/types";
import { PlayerEffect } from "./effect";

export abstract class Player {
  name: string;
  id: number;
  pos: [number, number];
  radius: number;
  vel: [number, number];
  acc: [number, number];
  slide: [number, number];
  speed: number;
  energy: number;
  maxEnergy: number;
  downed: boolean;
  regeneration: number;
  area: number;
  world: string;
  angle: number;
  dTimer: number;

  canMove: boolean;
  immortal: boolean;
  aura: number;
  auraColor: string;
  role: AccountRole;

  state = 0;
  stateMeta = 0;
  hero = 0;

  awards: string[] = [];

  abstract firstAbility: Ability;
  abstract secondAbility: Ability;

  effects: Record<string, PlayerEffect> = {};

  constructor(props: PlayerProps) {
    this.name = props.name;
    this.id = props.id;
    this.pos = [
      random(gameConfig.spawn.sx, gameConfig.spawn.ex),
      random(gameConfig.spawn.sy, gameConfig.spawn.ey),
    ];

    this.radius = gameConfig.spawn.radius;
    this.vel = [0, 0];
    this.acc = [0, 0];
    this.slide = [0, 0];
    this.speed = gameConfig.spawn.speed;
    this.energy = gameConfig.spawn.energy;
    this.maxEnergy = gameConfig.spawn.energy;
    this.regeneration = gameConfig.spawn.regeneration;
    this.area = gameConfig.spawn.area;
    this.world = gameConfig.spawn.world;
    this.angle = 0;
    this.dTimer = 60;

    this.canMove = true;
    this.immortal = false;
    this.aura = 0;
    this.auraColor = "";
    this.role = props.role;
    this.downed = false;
  }

  update(update: UpdatePlayer) {
    const { delta, timeFix } = update;
    this.regenerateEnergy(delta);
    for (const i in this.effects) this.effects[i].update(update);

    let slide = [this.slide[0], this.slide[1]];

    let dim = 1 - 0.75;

    slide[0] *= 1 - (1 - dim) * timeFix;
    slide[1] *= 1 - (1 - dim) * timeFix;

    this.acc[0] *= timeFix;
    this.acc[1] *= timeFix;

    this.acc[0] += slide[0];
    this.acc[1] += slide[1];

    if (Math.abs(this.acc[0]) < 0.1) this.acc[0] = 0;
    if (Math.abs(this.acc[1]) < 0.1) this.acc[1] = 0;

    this.vel = [this.acc[0], this.acc[1]];

    if (this.downed || !this.canMove) {
      this.vel[0] = 0;
      this.vel[1] = 0;
    }

    this.pos[0] += this.vel[0] * timeFix;
    this.pos[1] += this.vel[1] * timeFix;

    this.pos[0] = Math.round(this.pos[0] * 100) / 100;
    this.pos[1] = Math.round(this.pos[1] * 100) / 100;

    this.slide = [this.acc[0] + 0, this.acc[1] + 0];
    this.acc = [0, 0];

    if (this.downed) this.dTimer -= delta / 1000;

    this.firstAbility.update(update);
    this.secondAbility.update(update);

    if (this.energy < 0) {
      this.firstAbility.noEnergy();
      this.secondAbility.noEnergy();
      this.energy = 0;
    }
    if (this.energy > this.maxEnergy) this.energy = this.maxEnergy;
  }

  input(input: Input) {
    let shift = input.shift ? 0.5 : 1;
    if (input.left) {
      this.acc[0] = -this.speed * shift;
    }
    if (input.right) {
      this.acc[0] = this.speed * shift;
    }
    if (input.up) {
      this.acc[1] = -this.speed * shift;
    }
    if (input.down) {
      this.acc[1] = this.speed * shift;
    }

    if (input.mouseEnable && input.mousePos) {
      let dist = distance(0, 0, input.mousePos![0], input.mousePos![1]);

      let speedX = input.mousePos![0];
      let speedY = input.mousePos![1];

      if (dist > 150) {
        speedX = input.mousePos![0] * (150 / dist);
        speedY = input.mousePos![1] * (150 / dist);
      }

      this.angle = Math.atan2(speedY, speedX);

      let mouseDist = Math.min(
        150,
        Math.sqrt(input.mousePos![0] ** 2 + input.mousePos![1] ** 2)
      );
      let distMovement = this.speed * shift;
      distMovement *= mouseDist / 150;

      this.acc[0] = distMovement * Math.cos(this.angle);
      this.acc[1] = distMovement * Math.sin(this.angle);
    }

    if (input.first) {
      this.firstAbility.activate();
      input.first = false;
    }

    if (input.second) {
      this.secondAbility.activate();
      input.second = false;
    }
  }

  regenerateEnergy(delta: number) {
    let addEnergy = this.regeneration * (delta / 1000);
    if (addEnergy > this.maxEnergy - this.energy)
      addEnergy = this.maxEnergy - this.energy;
    this.energy += addEnergy;
  }

  knock() {
    this.downed = true;
    this.dTimer = gameConfig.spawn.downedTimer;
    this.firstAbility.deactivate();
    this.secondAbility.deactivate();
  }

  res() {
    this.downed = false;
    this.dTimer = gameConfig.spawn.downedTimer + 1;
  }

  collide(area: { w: number; h: number }) {
    if (this.pos[0] - this.radius < -10 * tile) {
      this.pos[0] = this.radius + -10 * tile;
    }
    if (this.pos[0] + this.radius > area.w + 10 * tile) {
      this.pos[0] = area.w - this.radius + 10 * tile;
    }
    if (this.pos[1] - this.radius < 0) {
      this.pos[1] = this.radius;
    }
    if (this.pos[1] + this.radius > area.h) {
      this.pos[1] = area.h - this.radius;
    }
  }

  consumeEnergy(count: number, delta: number) {
    if (this.energy >= count) {
      this.energy -= count * (delta / 1000);
      return true;
    }
    return false;
  }

  addAward(awardId: string) {
    if (!this.awards.includes(awardId)) {
      this.awards.push(awardId);
      return false;
    }
    return true;
  }

  addEffect(id: number, effect: PlayerEffect) {
    if (!Object.keys(this.effects).includes(id + "")) this.effects[id] = effect;
  }

  hasEffect(id: number) {
    return this.effects[id] !== undefined;
  }

  removeEffect(id: number) {
    delete this.effects[id];
  }

  pack(): PackedPlayer {
    const first = this.firstAbility.pack();
    const second = this.secondAbility.pack();
    return {
      id: this.id,
      name: this.name,
      x: this.pos[0],
      y: this.pos[1],
      radius: this.radius,
      speed: this.speed,
      energy: Math.round(this.energy),
      died: this.downed ?? true,
      regeneration: this.regeneration,
      area: this.area,
      world: this.world,
      dTimer: Math.floor(this.dTimer),
      aura: this.aura,
      auraColor: this.auraColor,
      firstAbilityActive: first.active,
      firstAbilityLvl: first.level,
      firstAbilityMaxLvl: first.maxLevel,
      secondAbilityActive: second.active,
      secondAbilityLvl: second.level,
      secondAbilityMaxLvl: second.maxLevel,
      maxEnergy: this.maxEnergy,
      state: this.state,
      stateMeta: this.stateMeta,
      hero: this.hero,
      role: this.role,
    };
  }
}
