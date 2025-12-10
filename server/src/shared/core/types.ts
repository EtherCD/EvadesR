import { EncodeIntoResult } from "util";
import { Player } from "../../core/objects/player";
import { Area } from "../../core/world/area";
import { Entity } from "server/src/core/objects/entity";
import { AccountRole } from "shared/types";

export interface PlayerProps {
  id: number;
  name: string;
  role: AccountRole;
}

export interface EntityProps {
  type: string;
  typeId: number;
  radius: number;
  aura?: number;
  speed: number;
  immune?: boolean;
  area: Area;
  angle?: number;
  x?: string | number;
  y?: string | number;
  count: number;
  num: number;
  inverse?: boolean;
}

export interface PlayerEffectProps {
  target: Player;
  caster: Entity;
}

export interface Update {
  timeFix: number;
  delta: number;
  area: Area;
  players: Record<number, Player>;
}

export interface PartialUpdate {
  timeFix: number;
  delta: number;
  players: Record<number, Player>;
}

export interface UpdatePlayer extends Update {
  area: Area;
  players: Record<string, Player>;
}
