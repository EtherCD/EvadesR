import { Player } from "../../units/player";

export class Maven extends Player {
  color = "#E6024F";

  renderMeta(
    ctx: CanvasRenderingContext2D,
    renderPos: { x: number; y: number }
  ) {
    if (this.state === 1) {
      ctx.beginPath();
      ctx.globalAlpha = 0.2;
      ctx.arc(renderPos.x, renderPos.y, 180, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }
  }
}
