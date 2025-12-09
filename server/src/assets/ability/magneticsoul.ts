import { sendToCore } from "server/src/core/send";
import { Ability } from "../../core/objects/ability";
import { EntityProps, Update, UpdatePlayer } from "../../shared/core/types";
import distance from "../../shared/distance";
import { Entity } from "server/src/core/objects/entity";
import { Player } from "server/src/core/objects/player";

export class MagneticSoulAbility extends Ability {
  consumeEnergy: number = 30;
  aura: number = 180;

  update(update: UpdatePlayer): void {
    if (this.caster.downed && this.active) {
      sendToCore.addEntity(
        new Soul({
          count: 1,
          type: "",
          name: "",
          num: 1,
          x: this.caster.pos[0],
          y: this.caster.pos[1],
          radius: this.caster.radius,
          area: update.area,
          speed: 0,
        }),
        this.caster.world,
        this.caster.area
      );
      this.active = false;
    }
  }

  activate(): void {
    this.caster.state = 1;
    if (this.caster.downed) this.active = true;
  }
  deactivate(): void {
    this.active = false;
  }
  noEnergy(): void {
    this.active = false;
  }
}

export class Soul extends Entity {
  type = 5;

  casterPos: number[];

  timeout = 6000;

  constructor(props: EntityProps) {
    super(props);
    this.casterPos = [this.pos[0] + 0, this.pos[1] + 0];
    this.harmless = true;
  }

  behavior(props: Update): void {
    this.timeout -= props.delta;

    for (const i in props.players) {
      const player = props.players[i];

      if (
        distance(
          this.casterPos[0],
          this.casterPos[1],
          player.pos[0],
          player.pos[1]
        ) <= 120
      ) {
        const dist = distance(
          this.casterPos[0],
          this.casterPos[1],
          player.pos[0],
          player.pos[1]
        );
        let angl = Math.atan2(
          player.pos[1] - this.casterPos[1],
          player.pos[0] - this.casterPos[0]
        );

        this.vel[0] = Math.cos(angl) * (dist / 120);
        this.vel[1] = Math.sin(angl) * (dist / 120);

        break;
      }
    }

    if (this.timeout < 0) this.toRemove = true;
  }
  auraEffect(player: Player): void {}

  interact(player: Player): void {
    if (!player.downed) {
      if (
        distance(player.pos[0], player.pos[1], this.pos[0], this.pos[1]) <=
        this.radius + player.radius
      ) {
        player.knock();
        this.toRemove = true;
      }
    }
  }

  collide(_: { w: number; h: number }): void {}
}
