import {
  ChatMessage,
  PackedPlayer,
  AreaInit,
  PackedEntity,
} from "@shared/types";
import { networkEvents } from "../services/events/network";
import { Entity } from "./objects/entity";
import { coreEvents } from "../services/events/core";
import { databaseEvents } from "../services/events/db";
import { DBAccount } from "../services/db/objects/account";

export const sendToNetwork = {
  message: (message: ChatMessage) => {
    networkEvents.emit("all", { message });
  },
  newPlayer: (newPlayer: PackedPlayer) => {
    networkEvents.emit("all", { newPlayer });
  },
  closePlayer: (closePlayer: number) => {
    networkEvents.emit("all", { closePlayer });
  },
  players: (id: number, players: Record<number, PackedPlayer>) => {
    networkEvents.emit("direct", { id, value: { players } });
  },
  self: (id: number, self: PackedPlayer) => {
    networkEvents.emit("direct", { id, value: { self } });
  },
  updatePlayers: (updatePlayers: Record<number, Partial<PackedPlayer>>) => {
    networkEvents.emit("all", { updatePlayers });
  },
  areaInit: (id: number, areaInit: AreaInit) => {
    networkEvents.emit("direct", { id, value: { areaInit } });
  },
  updateEntities: (id: number, updateEntities: Partial<PackedEntity>) => {
    networkEvents.emit("direct", { id, value: { updateEntities } });
  },
  close: (id: number, reason: string) => {
    networkEvents.emit("close", {
      id,
      reason,
    });
  },
  win: async (id: number, vp: number) => {
    networkEvents.emit("win", {
      id,
      vp,
    });
  },
  newEntities: (ids: number[], eId: number, entity: PackedEntity) => {
    for (const id of ids)
      networkEvents.emit("direct", {
        id,
        value: {
          newEntities: { [eId]: entity },
        },
      });
  },
  closeEntities: (ids: number[], eId: number) => {
    for (const id of ids)
      networkEvents.emit("direct", {
        id,
        value: {
          closeEntities: [eId],
        },
      });
  },
};

export const sendToCore = {
  addEntity(ent: Entity, world: string, area: number) {
    coreEvents.emit("newEntity", {
      ent,
      world,
      area,
    });
  },
};

export const sendToDB = {
  award(props: { username: string; vp: number; accessory?: string }) {
    databaseEvents.emit("award", props);
  },
};
