export interface PackedEntity {
  id: number;
  typeId: number;
  x: number;
  y: number;
  aura?: number;
  radius: number;
  harmless: boolean;
  state: number;
  stateMetadata: number;
  alpha: number;
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
  died: boolean;
  regeneration: number;
  area: number;
  world: string;
  deathTimer: number;
  aura: number;
  auraColor: string;
  firstAbilityLvl: number;
  firstAbilityMaxLvl: number;
  firstAbilityActive: boolean;
  secondAbilityLvl: number;
  secondAbilityMaxLvl: number;
  secondAbilityActive: boolean;
  state: number;
  stateMeta: number;
  hero: number;
  role: AccountRole;
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

export enum AccountRole {
  None = 0,
  MapMaker,
  Dev,
}

export interface AreaInit {
  world: string;
  area: number;
  w: number;
  h: number;
  entities: Record<number, PackedEntity>;
}

export interface RawClient {
  fillStyle: string;
  strokeStyle: string;
  areaFill: string;
  areaAlpha?: number;
  backgrounds?: Array<[string, number]>;
  effect: WorldEffect;
}

export enum WorldEffect {
  Rain = 0,
  RainStorm,
  Snow,
  SnowStorm,
  Autumn,
}

export interface ClientWorld {
  client: RawClient;
  areas: Record<number, ClientArea>;
}

export interface ClientArea {
  win?: boolean;
  vp?: number;
  text?: string;
}

export interface AssetsWorld {
  effect?: WorldEffect;
  backgrounds?: Array<[string, number]>;
  fillColor: string;
  fillAlpha: number;
}

export interface AssetsZone {
  fillColor: string;
}

export type AssetsEntity = [string];

export interface Assets {
  textures: Record<string, string>;
  zones: Record<string, AssetsZone>;
  entities: Array<AssetsEntity>;
}
