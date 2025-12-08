import { WebSocket } from "uWebSockets.js";
import { Client } from "..";

export const ability = (ws: WebSocket<Client>, key: string) => {
	const accessedKeys = ["first", "second"];
	const client = ws.getUserData();
	if (accessedKeys.includes(key)) {
		client.input[key as "first" | "second"] = true;
	}
};
