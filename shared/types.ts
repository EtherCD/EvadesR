export interface PackedEntity {
  type: number;
  x: number;
  y: number;
  aura?: number;
  radius: number;
  harmless: boolean;
  state: number;
  stateMetadata: number;
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
  died: number;
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
  state: number;
  stateMeta: number;
  hero: number;
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
