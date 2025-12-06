import { random } from "../../shared/random";
import { gameConfig, tile } from "../../shared/config";
import { PackedPlayer, PlayerProps, Update, UserRole } from "../../shared/game/types";
import distance from "../../shared/distance";
import { Movement } from "../../shared/ws/types";

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
	role: UserRole;

	constructor(props: PlayerProps) {
		this.name = props.name;
		this.id = props.id;
		this.pos = [random(gameConfig.spawn.sx, gameConfig.spawn.ex), random(gameConfig.spawn.sy, gameConfig.spawn.ey)];

		this.radius = gameConfig.spawn.radius;
		this.vel = [0, 0];
		this.acc = [0, 0];
		this.slide = [0, 0];
		this.speed = gameConfig.spawn.speed;
		this.energy = gameConfig.spawn.energy;
		this.maxEnergy = gameConfig.spawn.energy;
		this.regeneration = gameConfig.spawn.regeneration;
		this.downed = false;
		this.area = gameConfig.spawn.area;
		this.world = gameConfig.spawn.world;
		this.angle = 0;
		this.dTimer = 60;

		this.canMove = true;
		this.immortal = false;
		this.aura = 0;
		this.auraColor = "";
		this.role = UserRole.None;
	}

	update({ delta, timeFix }: Update) {
		this.regenerateEnergy(delta);

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

		if (this.energy < 0) {
			this.noEnergy();
			this.energy = 0;
		}
		if (this.energy > this.maxEnergy) this.energy = this.maxEnergy;
	}

	move(movement: Movement) {
		let shift = movement.shift ? 0.5 : 1;
		if (movement.left) {
			this.acc[0] = -this.speed * shift;
		}
		if (movement.right) {
			this.acc[0] = this.speed * shift;
		}
		if (movement.up) {
			this.acc[1] = -this.speed * shift;
		}
		if (movement.down) {
			this.acc[1] = this.speed * shift;
		}

		if (movement.mouseEnable && movement.mousePos) {
			let dist = distance(0, 0, movement.mousePos![0], movement.mousePos![1]);

			let speedX = movement.mousePos![0];
			let speedY = movement.mousePos![1];

			if (dist > 150) {
				speedX = movement.mousePos![0] * (150 / dist);
				speedY = movement.mousePos![1] * (150 / dist);
			}

			this.angle = Math.atan2(speedY, speedX);

			let mouseDist = Math.min(150, Math.sqrt(movement.mousePos![0] ** 2 + movement.mousePos![1] ** 2));
			let distMovement = this.speed * shift;
			distMovement *= mouseDist / 150;

			this.acc[0] = distMovement * Math.cos(this.angle);
			this.acc[1] = distMovement * Math.sin(this.angle);
		}
	}

	regenerateEnergy(timeFix: number) {
		let addEnergy = this.regeneration * timeFix;
		if (addEnergy > this.maxEnergy - this.energy) addEnergy = this.maxEnergy - this.energy;
		this.energy += addEnergy;
	}

	knock() {
		this.downed = true;
		this.dTimer = gameConfig.spawn.downedTimer;
		this.deactivateFirstAbility();
		this.deactivateSecondAbility();
	}

	res() {
		this.downed = false;
		this.dTimer = gameConfig.spawn.downedTimer;
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

	abstract noEnergy(): void;
	abstract useFirstAbility(): void;
	abstract useSecondAbility(): void;
	abstract deactivateFirstAbility(): void;
	abstract deactivateSecondAbility(): void;

	pack(): PackedPlayer {
		return {
			id: this.id,
			name: this.name,
			x: this.pos[0],
			y: this.pos[1],
			radius: this.radius,
			speed: this.speed,
			energy: Math.round(this.energy),
			downed: this.downed,
			regeneration: this.regeneration,
			area: this.area,
			world: this.world,
			dTimer: this.dTimer,
			aura: this.aura,
			auraColor: this.auraColor,
		};
	}
}
