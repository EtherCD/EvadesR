import { WebSocket } from "uWebSockets.js";
import { Client } from "..";

export const KeyDown = (ws: WebSocket<Client>, key: string) => {
	const accessedKeys = ["left", "right", "up", "down", "shift"];
	const client = ws.getUserData();
	if (accessedKeys.includes(key)) {
		//@ts-ignore
		client.movement[key] = true;
	}
};
