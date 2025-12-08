import { create } from "zustand";
import Entity from "../game/units/entity";
import { Player } from "../game/units/player";
import Zone from "../game/units/zone";
import type {
  AreaInit,
  ChatMessage,
  PackedEntity,
  PackedPlayer,
} from "../game/types";

export interface GameState {
  areaBoundary: { w: number; h: number };
  players: Record<number, Player>;
  zones: Array<Zone>;
  entities: Record<number, Entity>;
  world: string;
  area: number;
}

export const gameState: GameState = {
  areaBoundary: { w: 0, h: 0 },
  zones: [],
  entities: {},
  players: {},
  world: "",
  area: 0,
};

export interface ShortPlayer {
  name: string;
  area: number;
  hero: string;
  world: string;
  died?: boolean;
  dt?: number;
}

interface State {
  selfId: number;
  players: Record<string, ShortPlayer>;
  messages: Array<ChatMessage>;
  isGameInit: boolean;

  message(data: ChatMessage): void;
  uplayers(data: Record<number, PackedPlayer>): void;
  self(data: PackedPlayer): void;
  areaInit(data: AreaInit): void;
  newPlayer(data: PackedPlayer): void;
  closePlayer(data: number): void;
  updatePlayers(data: Record<number, Partial<PackedPlayer>>): void;
  newEntities(data: Record<number, PackedEntity>): void;
  updateEntities(data: Record<number, Partial<PackedEntity>>): void;
  closeEntities(data: number[]): void;
}

export const useGameStore = create<State>((set, get) => ({
  selfId: -1,
  players: {},
  messages: [],
  isGameInit: false,
  message(data) {
    const old = get();
    set({
      messages: [...old.messages, data],
    });
  },
  uplayers(data: Record<number, PackedPlayer>) {
    for (const p in data) {
      const player = data[p];
      gameState.players[p] = new Player(player);
      const players = get().players;
      set({
        players: {
          ...players,
          [p]: {
            name: player.name,
            area: player.area,
            hero: "",
            world: player.world,
          },
        },
      });
    }
  },
  self(data) {
    set({ selfId: data.id, isGameInit: true });
    gameState.players[data.id] = new Player(data);
  },
  areaInit(data) {
    gameState.entities = {};
    for (const e in data.entities) {
      gameState.entities[e] = new Entity(data.entities[e]);
    }

    gameState.zones = [
      ...(data.area === 0
        ? [
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
          ]
        : [
            new Zone({
              x: -10 * 32,
              y: 0,
              w: 2 * 32,
              h: data.h,
              type: "teleport",
            }),
            new Zone({
              x: -8 * 32,
              y: 0,
              w: 8 * 32,
              h: data.h,
              type: "safe",
            }),
          ]),
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

    gameState.world = data.world;
    gameState.area = data.area;
    gameState.areaBoundary = {
      w: data.w,
      h: data.h,
    };
  },
  newPlayer(data) {
    gameState.players[data.id] = new Player(data);
    const players = get().players;
    set({
      players: {
        ...players,
        [data.id]: data,
      },
    });
  },
  closePlayer(data) {
    if (Object.keys(gameState.players).includes(data + "")) {
      delete gameState.players[data];
      const players = get().players;
      delete players[data];
      set({
        players,
      });
    }
  },
  updatePlayers(data) {
    for (const p in data) {
      gameState.players[p].accept(data[p]);
      const state = get().players;
      if (
        (data[p].dTimer !== undefined && state[p].dt !== data[p].dTimer) ||
        (data[p].downed !== undefined && state[p].died !== data[p].downed) ||
        (data[p].world !== undefined && state[p].world !== data[p].world) ||
        (data[p].area !== undefined && state[p].area !== data[p].area)
      ) {
        set({
          players: {
            ...state,
            [p]: {
              ...state[p],
              name: data[p].name ?? state[p].name,
              world: data[p].world ?? state[p].world,
              area: data[p].area ?? state[p].area,
              dt: data[p].dTimer ?? state[p].dt,
              died: data[p].downed ?? state[p].died,
            },
          },
        });
      }
    }
  },
  newEntities(data) {},
  updateEntities(data) {
    for (const e in data) {
      gameState.entities[e].accept(data[e]);
    }
  },
  closeEntities(data) {},
}));
