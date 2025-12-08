import { networkEvents } from "../services/events/network";
import {
  ChatMessage,
  PackedPlayer,
  AreaInit,
  PackedEntity,
} from "../shared/core/types";

export const sendToNetwork = {
  message: (m: ChatMessage) => {
    networkEvents.emit("all", { m });
  },
  newPlayer: (np: PackedPlayer) => {
    networkEvents.emit("all", { np });
  },
  closePlayer: (cp: number) => {
    networkEvents.emit("all", { cp });
  },
  players: (id: number, pls: Record<number, PackedPlayer>) => {
    networkEvents.emit("direct", { id, value: { pls } });
  },
  self: (id: number, s: PackedPlayer) => {
    networkEvents.emit("direct", { id, value: { s } });
  },
  updatePlayers: (p: Record<number, Partial<PackedPlayer>>) => {
    networkEvents.emit("all", { p });
  },
  areaInit: (id: number, ai: AreaInit) => {
    networkEvents.emit("direct", { id, value: { ai } });
  },
  updateEntities: (id: number, ue: Partial<PackedEntity>) => {
    networkEvents.emit("direct", { id, value: { ue } });
  },
};
