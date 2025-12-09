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

    if (dist <= this.aura!) {
      const mult = 1.5 * (1 - dist / this.aura!) + 0.3;

      const dx = player.pos[0] - this.pos[0];
      const dy = player.pos[1] - this.pos[1];

      let angle = Math.atan2(dy, dx);
      angle += this.rotationSpeed * mult;

      player.pos[0] = this.pos[0] + dist * Math.cos(angle);
      player.pos[1] = this.pos[1] + dist * Math.sin(angle);
    }
  }

  auraEffect(player: Player): void {}
}
