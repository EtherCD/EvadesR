import type { PackedEntity, PackedPlayer } from "shared";
import { Maven } from "./render/hero/maven";
import type { Player } from "./units/player";
import Entity from "./units/entity";
import { Leaf } from "./render/entities/leaf";

type PlayerConstructor = new (props: PackedPlayer) => Player;

const heroes: Record<number, PlayerConstructor> = {
  0: Maven,
};

const entities: Record<number, typeof Entity> = {
  8: Leaf,
};

export class Spawn {
  static player(pkg: PackedPlayer) {
    const hero = heroes[pkg.hero];
    const player = new hero(pkg);
    return player;
  }
  static entity(pkg: PackedEntity) {
    const ent = entities[pkg.type];
    if (ent) return new ent(pkg);
    return new Entity(pkg);
  }
}
