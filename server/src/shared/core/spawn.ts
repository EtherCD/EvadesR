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
import { Tree } from "server/src/assets/entity/tree";
import { Bee } from "server/src/assets/entity/bee";
import {
  HomingBullet,
  HomingSniper,
} from "server/src/assets/entity/homingsniper";
import { Flame, Trail } from "server/src/assets/entity/flame";
import { FlameSniper } from "server/src/assets/entity/flamesniper";
import { Cloud } from "server/src/assets/entity/cloud";

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
  tree: Tree,
  bee: Bee,
  homing_sniper: HomingSniper,
  homing_bullet: HomingBullet,
  flame: Flame,
  // @ts-ignore
  trail: Trail,
  flame_sniper: FlameSniper,
  cloud: Cloud,
};

export const entityNames = Object.keys(types);

export class SpawnFactory {
  static entity(props: EntityProps) {
    return new types[props.type ?? ""]({
      ...props,
      typeId: entityNames.indexOf(props.type ?? ""),
    });
  }
}
