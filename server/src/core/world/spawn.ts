import { Immune } from "../../assets/entity/immune";
import { Normal } from "../../assets/entity/normal";
import { Sniper } from "../../assets/entity/sniper";
import { Wall } from "../../assets/entity/wall";
import { EntityProps } from "../../shared/core/types";
import { Entity } from "../objects/entity";

type EntityConstructor = new (props: EntityProps) => Entity;

const types: Record<string, EntityConstructor> = {
  normal: Normal,
  wall: Wall,
  immune: Immune,
  sniper: Sniper,
};

export class SpawnFactory {
  static entity(props: EntityProps) {
    return new types[props.type](props);
  }
}
