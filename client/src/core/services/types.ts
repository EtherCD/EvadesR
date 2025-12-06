import type Entity from "../units/entity";
import type { Player } from "../units/player";
import type Zone from "../units/zone";
import { keyCodes } from "./keyboard";

export interface GameState {
	areaBoundary: { w: number; h: number };
	isGameInited: boolean;
	players: Record<number, Player>;
	zones: Array<Zone>;
	entities: Record<number, Entity>;
	world: string;
	area: number;
}

export interface ShortPlayer {
	name: string;
	area: number;
	world: string;
	died?: boolean;
	dt?: number;
}

export interface KeyboardState extends Record<keyof typeof keyCodes, boolean> {
	isChatting: boolean;
}

export interface ResizeState {
	scale: number;
	canvasLeft: number;
	canvasTop: number;
	canvasWidth: number;
	canvasHeight: number;
}

export interface MouseState {
	enable: boolean;
}

export interface AuthenticationState {
	isAuthenticated: boolean;
	username: string;
}
