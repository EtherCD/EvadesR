import type Entity from "./units/entity";

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
