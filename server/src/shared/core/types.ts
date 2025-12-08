import { Player } from "../../core/objects/player";
import { Area } from "../../core/world/area";

export enum UserRole {
  Admin = 0,
  Dev,
  None,
}

export interface PlayerProps {
  id: number;
  name: string;
}

export interface EntityProps {
  name: string;
  type: string;
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

export interface Update {
  timeFix: number;
  delta: number;
}

export interface UpdatePlayer extends Update {
  area: Area;
  players: Record<string, Player>;
}
