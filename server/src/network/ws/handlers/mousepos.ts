import { WebSocket } from "uWebSockets.js";
import { Client } from "..";
import { logger } from "../../../services/logger";

export const mousePos = (ws: WebSocket<Client>, pos: [number, number]) => {
  ws.getUserData().input.setMousePosX(pos[0]);
  ws.getUserData().input.setMousePosY(pos[1]);
};
