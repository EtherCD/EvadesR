import createStore, { type Listener, type Store } from "unistore";
import type { GameState, ShortPlayer } from "./types";
import { Player } from "../units/player";
import Entity from "../units/entity";
import Zone from "../units/zone";
import { customEntities, customEntitiesKeys } from "../render";
import type { AreaInit, ChatMessage, PackedEntity, PackedPlayer } from "../types";

export class GameService {
	private static store: GameState = {
		areaBoundary: { w: 0, h: 0 },
		isGameInited: false,
		zones: [],
		entities: {},
		players: {},
		world: "",
		area: 0,
	};
	public static get state() {
		return GameService.store;
	}
	private static selfIdStore = createStore<{ id: number }>({ id: -1 });
	private static playersStore = createStore<Record<string, ShortPlayer>>({});
	private static messagesStore = createStore<{ messages: Array<ChatMessage> }>({ messages: [] });

	static message(data: ChatMessage) {
		GameService.messagesStore.setState({ messages: [...GameService.messagesState.messages, data] });
	}

	static players(data: Record<number, PackedPlayer>) {
		for (const player in data) {
			GameService.state.players[player] = new Player(data[player]);
			GameService.addElementToRecordStore(GameService.playersStore, player + "", data[player]);
		}
	}

	static self(data: PackedPlayer) {
		GameService.state.isGameInited = true;
		GameService.selfIdStore.setState({ id: data.id });
		GameService.state.players[data.id] = new Player(data);
		GameService.addElementToRecordStore(GameService.playersStore, data.id + "", data);
	}

	static areaInit(data: AreaInit) {
		GameService.state.entities = {};
		for (const e in data.entities) {
			GameService.state.entities[e] = new Entity(data.entities[e]);
		}

		GameService.state.zones = [
			new Zone({
				x: -10 * 32,
				y: 0,
				w: 10 * 32,
				h: 2 * 32,
				type: "teleport_world",
			}),
			new Zone({
				x: -10 * 32,
				y: 2 * 32,
				w: 10 * 32,
				h: data.h - 2 * 32,
				type: "safe",
			}),
			new Zone({
				x: -10 * 32,
				y: data.h - 2 * 32,
				w: 10 * 32,
				h: 2 * 32,
				type: "teleport_world",
			}),
			new Zone({
				x: 0,
				y: 0,
				w: data.w,
				h: data.h,
				type: "active",
			}),
			new Zone({
				x: data.w,
				y: 0,
				w: 8 * 32,
				h: data.h,
				type: "safe",
			}),
			new Zone({
				x: data.w + 8 * 32,
				y: 0,
				w: 2 * 32,
				h: data.h,
				type: "teleport",
			}),
		];

		GameService.state.world = data.world;
		GameService.state.area = data.area;
		GameService.state.areaBoundary = {
			w: data.w,
			h: data.h,
		};
	}

	static newPlayer(data: PackedPlayer) {
		GameService.state.players[data.id] = new Player(data);
		GameService.addElementToRecordStore(GameService.playersStore, data.id + "", data);
	}

	static closePlayer(data: number) {
		if (Object.keys(GameService.state.players).includes(data + "")) {
			delete GameService.state.players[data];
		}
		GameService.removeElementFromRecordStore(GameService.playersStore, data + "");
	}

	static updatePlayers(data: Record<number, Partial<PackedPlayer>>) {
		for (const p in data) {
			GameService.state.players[p].accept(data[p]);
			const state = GameService.playersState;
			if (
				(data[p].dTimer !== undefined && state[p].dt !== data[p].dTimer) ||
				(data[p].downed !== undefined && state[p].died !== data[p].downed) ||
				(data[p].world !== undefined && state[p].world !== data[p].world) ||
				(data[p].area !== undefined && state[p].area !== data[p].area)
			) {
				GameService.playersStore.setState({
					[p]: {
						...state[p],
						world: data[p].world ?? state[p].world,
						area: data[p].area ?? state[p].area,
						dt: data[p].dTimer ?? state[p].dt,
						died: data[p].downed ?? state[p].died,
					},
				});
			}
		}
	}

	static newEntities(data: Record<number, PackedEntity>) {
		for (const e in data) {
			GameService.state.entities[e] = new Entity(data[e]);
		}
	}

	static updateEntities(data: Record<number, Partial<PackedEntity>>) {
		for (const e in data) {
			GameService.state.entities[e].accept(data[e]);
		}
	}

	static closeEntities(data: number[]) {
		for (const e in data) {
			delete GameService.state.entities[data[e]];
		}
	}

	private static addElementToRecordStore<K extends string, T extends object>(state: Store<Record<K, T>>, key: K, element: T) {
		state.setState({ ...state.getState(), [key]: element });
	}

	private static removeElementFromRecordStore<K extends string, T extends object>(state: Store<Record<K, T>>, key: K) {
		let oldState = state.getState();
		if (Object.keys(oldState).includes(key + "")) delete oldState[key];
		state.setState({ ...oldState });
	}

	static onPlayers(listener: Listener<Record<string, ShortPlayer>>) {
		GameService.playersStore.subscribe(listener);
	}
	static offPlayers(listener: Listener<Record<string, ShortPlayer>>) {
		GameService.playersStore.unsubscribe(listener);
	}
	static onMessages(listener: Listener<{ messages: Array<ChatMessage> }>) {
		GameService.messagesStore.subscribe(listener);
	}
	static offMessages(listener: Listener<{ messages: Array<ChatMessage> }>) {
		GameService.messagesStore.unsubscribe(listener);
	}
	static onSelfId(listener: Listener<{ id: number }>) {
		GameService.selfIdStore.subscribe(listener);
	}
	static offSelfId(listener: Listener<{ id: number }>) {
		GameService.selfIdStore.unsubscribe(listener);
	}
	static get selfPlayer() {
		return GameService.state.players[GameService.selfIdStore.getState().id];
	}
	static get playersState() {
		return GameService.playersStore.getState();
	}
	static get messagesState() {
		return GameService.messagesStore.getState();
	}
	static get selfIdState() {
		return GameService.selfIdStore.getState();
	}
}
