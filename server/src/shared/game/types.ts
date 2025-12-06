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
	downed: boolean;
	regeneration: number;
	area: number;
	world: string;
	dTimer: number;
	aura: number;
	auraColor: string;
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
