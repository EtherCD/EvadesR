import { Entity } from "server/src/core/objects/entity";
import { Player } from "server/src/core/objects/player";
import { EntityProps, Update } from "server/src/shared/core/types";
import { Leaf } from "./leaf";
import { random } from "server/src/shared/random";
import { entityNames } from "server/src/shared/core/spawn";

export class Tree extends Entity {
  count = random(10, 20);
  time = 2000;
  constructor(props: EntityProps) {
    super(props);
    this.aura = props.aura ?? 150;
    this.state = 1;
    this.stateMetadata = this.aura;
  }

  behavior(props: Update): void {
    if (this.count <= 0) return;
    this.time -= props.delta;
    if (this.time < 0) {
      this.time = 0;
      this.count -= 1;
      this.time = 2000;
      const radius = Math.round(random(18, 25));
      const dist = Math.round(random(this.radius, this.aura!));
      const angle = Math.random() * Math.PI * 2;
      const [x, y] = [
        Math.cos(angle) * dist + this.pos[0],
        Math.sin(angle) * dist + this.pos[1],
      ];
      const leaf = new Leaf({
        area: this.area,
        count: 0,
        num: 0,
        radius: radius,
        x,
        y,
        speed: 0,
        type: "leaf",
        typeId: entityNames.indexOf("leaf"),
      });
      leaf.collide(this.area);
      this.area.addEntity(leaf);
    }
  }
  auraEffect(player: Player): void {}
}
