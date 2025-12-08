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
  type: number;
  radius: number;
  aura?: number;
  speed: number;
  immune?: boolean;
  area: { w: number; h: number };
  angle?: number;
  x?: string | number;
  y?: string | number;
}

export interface Update {
  timeFix: number;
  delta: number;
}

export interface UpdatePlayer extends Update {
  area: Area;
  players: Record<string, Player>;
}

export interface PackedEntity {
  type: number;
  x: number;
  y: number;
  aura?: number;
  radius: number;
  harmless: boolean;
}

export interface PackedPlayer {
  id: number;
  name: string;
  x: number;
  y: number;
  radius: number;
  speed: number;
  energy: number;
  maxEnergy: number;
  downed: boolean;
  regeneration: number;
  area: number;
  world: string;
  dTimer: number;
  aura: number;
  auraColor: string;
  firstAbilityLvl: number;
  firstAbilityMaxLvl: number;
  firstAbilityActive: boolean;
  secondAbilityLvl: number;
  secondAbilityMaxLvl: number;
  secondAbilityActive: boolean;
}

export interface PackedAbility {
  level: number;
  maxLevel: number;
  active: boolean;
}

export interface ChatMessage {
  author: string;
  msg: string;
  role: string;
  world: string;
  color?: string;
  id?: number;
}

export interface AreaInit {
  world: string;
  area: number;
  w: number;
  h: number;
  entities: Record<number, PackedEntity>;
}
