import { Entity } from "server/src/core/objects/entity";
import { Player } from "server/src/core/objects/player";
import { entityNames } from "server/src/shared/core/spawn";
import { EntityProps, Update } from "server/src/shared/core/types";

export class Flame extends Entity {
  timer = 0;

  light = true;

  behavior({ delta }: Update): void {
    this.timer += delta;
    if (this.timer >= 32.5 * ((this.radius * 2) / this.speed)) {
      const trail = new Trail({
        x: this.pos[0],
        y: this.pos[1],
        radius: this.radius,
        speed: 0,
        area: this.area,
        ownerSpeed: this.speed,
        type: "",
        typeId: entityNames.indexOf("trail"),
        count: 0,
        num: 0,
      });

      this.area.addEntity(trail);

      this.timer = 0;
    }
  }
  auraEffect(player: Player): void {}
}

export class Trail extends Entity {
  ownerSpeed: number;
  timer = 0;
  alpha = 1;
  constructor(props: EntityProps & { ownerSpeed: number }) {
    super(props);
    this.ownerSpeed = props.ownerSpeed;
  }

  behavior({ delta }: Update): void {
    this.timer += delta;
    this.alpha = 1 - this.timer / (5000 / this.ownerSpeed);
    if (this.timer >= 5000 / this.ownerSpeed) this.toRemove = true;
  }
  auraEffect(player: Player): void {}
}
