import type { ISplitPlayerInit, IUpdatePlayer } from "../types";
import Camera from "../storages/camera";
import MaxCurContainer from "../units/maxcur";

export class Player {
	x: number;
	y: number;
	id: number;
	name: string;
	area: number;
	hero: string;
	world: string;
	color: string;
	speed: MaxCurContainer;
	regen: MaxCurContainer;
	radius: number;
	energy: MaxCurContainer;

	/**
	 * First Ability Level
	 */
	fal: MaxCurContainer;
	/**
	 * Second Ability Level
	 */
	sal: MaxCurContainer;

	died: boolean;
	/**
	 * Died Timer
	 */
	dt: number;

	constructor(props: ISplitPlayerInit) {
		this.x = props.x ? props.x / 10 : 0;
		this.y = props.y ? props.y / 10 : 0;
		this.dt = props.dTimer ?? 60;
		this.id = props.id;
		this.name = props.name;
		this.area = props.area;
		this.hero = props.hero;
		this.died = props.died ?? false;
		this.color = props.color ?? "#FF0000";
		this.world = props.world;
		this.fal = new MaxCurContainer(props.firstAbLvl ?? 0, props.firstAbMaxLvl ?? 5);
		this.sal = new MaxCurContainer(props.secondAbLvl ?? 0, props.secondAbMaxLvl ?? 5);
		this.regen = new MaxCurContainer(props.speed ?? 1, 7);
		this.speed = new MaxCurContainer(props.speed ?? 5, 17);
		this.energy = new MaxCurContainer(props.energy ?? 0, props.maxEnergy ?? 30);
		this.radius = props.radius ?? 15;
	}

	draw(ctx: CanvasRenderingContext2D, sid: number) {
		let pos: { x: number; y: number };
		if (sid === this.id)
			pos = {
				x: Camera.w / 2 + (Camera.x - this.x) * Camera.s,
				y: Camera.h / 2 + (Camera.y - this.y) * Camera.s,
			};
		else
			pos = {
				x: Camera.w / 2 - (Camera.x - this.x) * Camera.s,
				y: Camera.h / 2 - (Camera.y - this.y) * Camera.s,
			};

		ctx.beginPath();
		ctx.fillStyle = this.color;
		if (this.died) {
			ctx.globalAlpha = 0.2;
		}
		ctx.arc(Camera.w / 2 + (this.x - Camera.x) * Camera.s, Camera.h / 2 + (this.y - Camera.y) * Camera.s, this.radius * Camera.s, 0, Math.PI * 2);
		ctx.fill();
		if (this.died) {
			ctx.fillStyle = "red";
			ctx.globalAlpha = 1;
			ctx.font = 14 * Camera.s + "px Tahoma, Verdana, Segoe, sans-serif";
			ctx.textAlign = "center";
			ctx.fillText(this.dt + "", pos.x, pos.y + 14 / 2);
		}
		ctx.closePath();

		ctx.beginPath();
		ctx.globalAlpha = 1;
		ctx.fillStyle = "#0000FF";
		ctx.fillRect(pos.x - 18 * Camera.s, pos.y - (this.radius + 8) * Camera.s, 36 * (this.energy.cur / this.energy.max) * Camera.s, 7 * Camera.s);
		ctx.strokeStyle = "rgb(68, 118, 225)";
		ctx.lineWidth = 2;
		ctx.strokeRect(pos.x - 18 * Camera.s, pos.y - (this.radius + 8) * Camera.s, 36 * Camera.s, 7 * Camera.s);
		ctx.closePath();

		ctx.beginPath();
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.font = 12 * Camera.s + "px Tahoma, Verdana, Segoe, sans-serif";
		ctx.fillText(this.name, pos.x, pos.y - (this.radius + 11) * Camera.s);
		ctx.closePath();
	}

	accept(props: IUpdatePlayer) {
		this.x = props.x ? props.x / 10 : this.x;
		this.y = props.y ? props.y / 10 : this.y;
		this.world = props.world ?? this.world;
		this.area = props.area ?? this.area;
		this.energy.accept(props.energy, props.maxEnergy);
		this.color = props.color ?? this.color;
		this.speed.accept(props.speed);
		this.regen.accept(props.regen);
		this.fal.accept(props.firstAbLvl);
		this.sal.accept(props.secondAbLvl);
		this.died = props.died ?? this.died;
		this.dt = props.dTimer ?? this.dt;
	}
}
