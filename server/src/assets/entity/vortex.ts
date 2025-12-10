import { Entity } from "server/src/core/objects/entity";
import { Player } from "server/src/core/objects/player";
import { EntityProps, Update } from "server/src/shared/core/types";
import distance from "server/src/shared/distance";

export class Vortex extends Entity {
  rotationSpeed = 0.005;

  constructor(props: EntityProps) {
    super(props);
    this.state = 1;
    this.aura = props.aura ?? 150;
    this.state = 1;
    this.stateMetadata = this.aura;
    this.harmless = true;
  }

  behavior(props: Update): void {}

  interact(player: Player) {
    super.interact(player);

    const dist = distance(
      player.pos[0],
      player.pos[1],
      this.pos[0],
      this.pos[1]
    );

    if (dist <= this.aura! && !player.downed) {
      const dx = player.pos[0] - this.pos[0];
      const dy = player.pos[1] - this.pos[1];

      let angle = Math.atan2(dy, dx);

      const rotMult = 1 - dist / this.aura!;
      angle += this.rotationSpeed * (1 + rotMult * 2);

      const suckStrength = 0.6;
      const newDist = Math.max(
        5,
        dist - suckStrength * (1 - dist / this.aura!)
      );

      player.pos[0] = this.pos[0] + newDist * Math.cos(angle);
      player.pos[1] = this.pos[1] + newDist * Math.sin(angle);
    }
  }

  auraEffect(player: Player): void {}
}
