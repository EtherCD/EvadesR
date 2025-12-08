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

export interface PackedPlayer {
  id: number;
  name: string;
  x: number;
  y: number;
  radius: number;
  speed: number;
  energy: number;
  downed: boolean;
  regeneration: number;
  area: number;
  world: string;
  dTimer: number;
  aura: number;
  auraColor: string;
}

export interface PackedEntity {
  type: number;
  x: number;
  y: number;
  aura?: number;
  radius: number;
  harmless: boolean;
}
