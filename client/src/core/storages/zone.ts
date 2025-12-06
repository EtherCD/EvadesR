import type { IZoneInit } from "../types";
import AssetLoader from "../storages/assets";
import Camera from "../storages/camera";
import { GlobalAssets } from "../assets";

export default class Zone {
	type: string;
	x: number;
	y: number;
	w: number;
	h: number;
	color: string;

	constructor(props: IZoneInit) {
		this.x = props.x;
		this.y = props.y;
		this.w = props.w;
		this.h = props.h;
		this.type = props.type;
		this.color = GlobalAssets.zones[props.type].fillColor ?? "#666";
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.fillStyle = AssetLoader.tiles[this.type] ?? this.color;
		ctx.globalAlpha = 1;
		ctx.rect(Camera.w / 2 + (this.x - Camera.x) * Camera.s, Camera.h / 2 + (this.y - Camera.y) * Camera.s, this.w * Camera.s, this.h * Camera.s);
		ctx.fill();
		ctx.closePath();
		ctx.beginPath();
		ctx.fillStyle = "rgba(91,122,132,0.39)";
		ctx.rect(Camera.w / 2 + (this.x - Camera.x) * Camera.s, Camera.h / 2 + (this.y - Camera.y) * Camera.s, this.w * Camera.s, this.h * Camera.s);
		ctx.fill();
		ctx.closePath();
	}
}
