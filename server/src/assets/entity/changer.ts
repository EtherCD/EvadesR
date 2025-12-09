import { Entity } from "../../core/objects/entity";
import { Player } from "../../core/objects/player";
import { tile } from "../../shared/config";
import { EntityProps, Update } from "../../shared/core/types";
import distance from "../../shared/distance";

export class Changer extends Entity {
  name = "changerr";
  delay = 3000;
  timer = 0;
  disable = false;
  maxTimer = 5000;
  constructor(data: EntityProps) {
    super(data);

    if (data.num >= data.count / 2) {
      this.disable = true;
    }
  }

  behavior({ delta }: Update) {
    this.timer += delta;

    if (this.timer > this.maxTimer) {
      this.disable = !this.disable;
    }

    this.harmless = this.disable;

    this.timer = this.timer % this.maxTimer;
  }

  auraEffect(player: Player): void {}
}
