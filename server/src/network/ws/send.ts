import { coreEvents } from "../../services/events/core";
import { PlayerProps } from "../../shared/core/types";

export const sendToCore = {
  join(props: PlayerProps) {
    coreEvents.emit("join", props);
  },
  leave(id: number, reason?: string) {
    coreEvents.emit("leave", { id, reason });
  },
  message(id: number, msg: string) {
    coreEvents.emit("message", { id, msg });
  },
};
