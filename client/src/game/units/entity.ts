import type { PackedEntity } from "shared";
import { GlobalAssets } from "shared/assets";
import Camera from "../storages/camera";

export default class Entity {
  harmless: boolean;
  radius: number;
  aura: number;
  type: number;
  x: number;
  y: number;
  alpha: number;
  state: number;
  stateMetadata: number;

  constructor(props: PackedEntity) {
    this.x = props.x / 10;
    this.y = props.y / 10;
    this.aura = props.aura ? props.aura/10 : 0;
    this.type = props.typeId;
    this.radius = props.radius / 10;
    this.harmless = props.harmless ?? false;
    this.alpha = props.alpha / 10;
    this.state = props.state;
    this.stateMetadata = props.stateMetadata / 10;
  }

  draw(ctx: CanvasRenderingContext2D, _: number) {
    ctx.beginPath();
    ctx.lineWidth = 2 * Camera.s;
    const ent = GlobalAssets.entities[this.type];
    ctx.fillStyle = (ent ?? ["#fff"])[0];
    ctx.strokeStyle = "#000000";
    ctx.globalAlpha = this.alpha !== 1 ? this.alpha : this.harmless ? 0.4 : 1;
    const pos = Camera.transform(this);
    ctx.arc(pos.x, pos.y, this.radius * Camera.s, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.globalAlpha = 1;
  }

  drawaura(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    const ent = GlobalAssets.entities[this.type];
    ctx.fillStyle = (ent ?? ["#fff"])[0];
    ctx.globalAlpha = 0.15;
    if (this.state === 1)
      ctx.arc(
        Camera.w / 2 + (this.x - Camera.x) * Camera.s,
        Camera.h / 2 + (this.y - Camera.y) * Camera.s,
        this.stateMetadata * Camera.s,
        0,
        Math.PI * 2
      );
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.closePath();
  }

  accept(props: Partial<PackedEntity>) {
    this.x = props.x ? props.x / 10: this.x;
    this.y = props.y ? props.y /10: this.y;
    this.type = props.typeId ?? this.type;
    this.radius = props.radius ? props.radius / 10 : this.radius;
    this.harmless = props.harmless ?? this.harmless;
    this.alpha = props.alpha != undefined ? props.alpha / 100: this.alpha;
  }
}
