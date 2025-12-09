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
    instance?: typeof Entity;
  }?
];

export interface Assets {
  textures: Record<string, string>;
  zones: Record<string, AssetsZone>;
  entities: Array<AssetsEntity>;
}
