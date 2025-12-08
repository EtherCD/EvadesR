export interface RawWorld {
  client: RawWorldClient;
  name: string;
  areas: RawArea[];
}

export interface RawWorldClient {
  fill: string;
  stroke: string;
  areaFill: string;
}

export interface RawArea {
  enemies: RawEntity[];
  w: number;
  h: number;
  id: number;
  world: string;
}

export interface RawEntity {
  types: string[];
  radius: number;
  speed: number;
  count: number;
}
