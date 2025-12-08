// WebSocket

import type Entity from "./units/entity";

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
  firstAbility: PackedAbility;
  secondAbility: PackedAbility;
}

export interface PackedAbility {
  level: number;
  maxLevel: number;
  active: boolean;
}
// End WebSocket

export enum WorldEffect {
  RainStorm = "RainStorm",
  SnowStorm = "SnowStorm",
  Rain = "Rain",
  Snow = "Snow",
  LeafFall = "LeafFall",
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

/**
 * color, {}
 */
export type AssetsEntity = [
  string,
  {
    instance?: Entity;
  }?
];

export interface Assets {
  textures: Record<string, string>;
  worlds: Record<string, AssetsWorld>;
  zones: Record<string, AssetsZone>;
  entities: Array<AssetsEntity>;
}
