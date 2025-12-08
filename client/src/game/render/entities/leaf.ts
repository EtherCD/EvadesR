import type { PackedEntity } from "shared";
import AssetLoader from "../../storages/assets";
import Camera from "../../storages/camera";
import Entity from "../../units/entity";

const arr = [AssetLoader.images.leaf, AssetLoader.images.leaf2];

export class Leaf extends Entity {
  leafImage: HTMLImageElement;

  constructor(props: PackedEntity) {
    super(props);
    this.leafImage = arr[Math.round(Math.random())];
  }

  accept(props: Partial<PackedEntity>): void {
    super.accept(props);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.globalAlpha = this.harmless ? 0.4 : 1;
    const pos = Camera.transform(this);
    const size = this.radius * 2 * Camera.s;

    ctx.drawImage(
      this.leafImage,
      pos.x - size / 2,
      pos.y - size / 2,
      size,
      size
    );
    ctx.closePath();
  }
}
