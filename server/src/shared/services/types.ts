import { RawClient } from "shared/types";

export interface RawWorld {
  name: string;
  areas: RawArea[];
  client: RawClient;
}

export interface RawArea {
  enemies: RawEntity[];
  w: number;
  h: number;
  id: number;
  world: string;
  win?: boolean;
  vp?: number;
  text?: string;
}

export interface RawEntity {
  types: string[];
  radius: number;
  speed: number;
  count: number;
}
