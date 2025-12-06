import { WebSocket } from "uWebSockets.js";
import { Client } from "..";
import { logger } from "../../../services/logger";

export const mousePos = (ws: WebSocket<Client>, pos: [number, number]) => {
	logger.info(pos);
	ws.getUserData().movement.mousePos = [pos[0], pos[1]];
};
