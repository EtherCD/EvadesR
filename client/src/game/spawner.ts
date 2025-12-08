import type { PackedPlayer } from "shared";
import { Maven } from "./render/hero/maven";
import type { Player } from "./units/player";

type PlayerConstructor = new (props: PackedPlayer) => Player;

const heroes: Record<number, PlayerConstructor> = {
  0: Maven,
};

export class Spawn {
  static player(pkg: PackedPlayer) {
    const hero = heroes[pkg.hero];
    const player = new hero(pkg);
    return player;
  }
}
