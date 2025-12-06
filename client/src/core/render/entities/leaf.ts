import { GlobalAssets } from "../../assets";
import { GameService } from "../../services/game";
import AssetLoader from "../../storages/assets";
import Camera from "../../storages/camera";
import type { IEntityInit, IEntityUpdate } from "../../types";
import Entity from "../../units/entity";
import { distance } from "../utils";

const arr = [AssetLoader.images.leaf, AssetLoader.images.leaf2];

export class Leaf extends Entity {
	leafImage: HTMLImageElement;

	constructor(props: IEntityInit) {
		super(props);
		this.leafImage = arr[Math.round(Math.random())];
	}

	accept(props: IEntityUpdate): void {
		super.accept(props);
	}

	draw(ctx: CanvasRenderingContext2D, delta: number): void {
		ctx.beginPath();
		ctx.globalAlpha = this.alpha ? this.alpha : this.harmless ? 0.4 : 1;
		const pos = Camera.transform(this);
		const size = this.radius * 2 * Camera.s;

		ctx.drawImage(this.leafImage, pos.x - size / 2, pos.y - size / 2, size, size);
		if (this.stroke) ctx.stroke();
		ctx.closePath();
	}
}
