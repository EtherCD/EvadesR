import { WebSocket } from "uWebSockets.js";
import { Client } from "..";

export const mouseEnable = (ws: WebSocket<Client>, enable: boolean) => {
	ws.getUserData().movement.mouseEnable = enable;
};
