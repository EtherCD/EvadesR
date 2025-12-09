import { Changer } from "server/src/assets/entity/changer";
import { Immune } from "../../assets/entity/immune";
import { Normal } from "../../assets/entity/normal";
import { Bullet, Sniper } from "../../assets/entity/sniper";
import { Wall } from "../../assets/entity/wall";
import { EntityProps } from "./types";
import { Entity } from "../../core/objects/entity";
import { Corrosive } from "server/src/assets/entity/corrosive";
import { Drop } from "server/src/assets/entity/drop";
import { Leaf } from "server/src/assets/entity/leaf";
import { Homing } from "server/src/assets/entity/homing";
import { Vortex } from "server/src/assets/entity/vortex";
import { Slower } from "server/src/assets/entity/slower";
import { Draining } from "server/src/assets/entity/draining";
import { Disable } from "server/src/assets/entity/disable";

type EntityConstructor = new (props: EntityProps) => Entity;

const types: Record<string, EntityConstructor> = {
  normal: Normal,
  wall: Wall,
  immune: Immune,
  sniper: Sniper,
  bullet: Bullet,
  changer: Changer,
  corrosive: Corrosive,
  drop: Drop,
  leaf: Leaf,
  homing: Homing,
  vortex: Vortex,
  slower: Slower,
  draining: Draining,
  disable: Disable,
};

const indexes = Object.keys(types);

export class SpawnFactory {
  static entity(props: EntityProps) {
    return new types[props.type ?? ""]({
      ...props,
      typeId: indexes.indexOf(props.type ?? ""),
    });
  }
}
