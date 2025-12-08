import {
  ChatMessage,
  PackedPlayer,
  AreaInit,
  PackedEntity,
} from "@shared/types";
import { networkEvents } from "../services/events/network";

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
