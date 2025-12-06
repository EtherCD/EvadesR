import { TemplatedApp, WebSocket } from "uWebSockets.js";
import { logger } from "../../services/logger";
import { clientMessageValidate } from "../../shared/ws/schema";
import { ClientMessage, Movement } from "../../shared/ws/types";
import { networkEvents } from "../../services/events/network";
import { sendToCore } from "./send";
import { KeyUp } from "./handlers/keyup";
import { KeyDown } from "./handlers/keydown";
import { mouseEnable } from "./handlers/mouseenable";
import { mousePos } from "./handlers/mousepos";

export interface Client {
	id: number;
	movement: Movement;
}

export class WebSocketServer {
	nextId = 0;
	clients = new Map<number, WebSocket<Client>>();
	constructor(app: TemplatedApp) {
		app.ws<Client>("/server", {
			open: (ws) => {
				const data = ws.getUserData();
				data.id = this.nextId++;
				data.movement = {};
				logger.info(`User connected ${data.id}`);
				this.clients.set(data.id, ws);
			},
			message: (ws, msg, isBinary) => {
				const rawData = JSON.parse(Buffer.from(msg).toString());
				const validate = clientMessageValidate(rawData);

				const client = ws.getUserData();

				if (validate) {
					const data = rawData as ClientMessage;

					const keys = Object.keys(data);

					for (const i of keys) {
						switch (i) {
							case "message":
								sendToCore.message(client.id, data.message!);
								break;
							case "keyUp":
								KeyUp(ws, data.keyUp!);
								break;
							case "keyDown":
								KeyDown(ws, data.keyDown!);
								break;
							case "init":
								const init = data.init!;
								sendToCore.join({
									name: init.name,
									id: client.id,
								});
								break;
							case "mousePos":
								mousePos(ws, data.mousePos!);
								break;
							case "mouseEnable":
								mouseEnable(ws, data.mouseEnable!);
								break;
							case "ability":
								break;
						}
					}
				} else {
					logger.info(`Client ${ws.getUserData().id} was disconnected by reason [ not valid message structure ]`);
					ws.close();
				}
			},
			close: (ws: WebSocket<Client>) => {
				const client = ws.getUserData();
				if (client.id !== undefined) {
					this.clients.delete(client.id);
					logger.info(`Client ${client.id} disconnected`);
					sendToCore.leave(client.id);
				}
			},
		});

		networkEvents.on("direct", (event) => {
			this.clients.get(event.id)!.send(JSON.stringify(event.value));
		});
		networkEvents.on("all", (event) => {
			for (const i of this.clients) {
				i[1].send(JSON.stringify(event));
			}
		});
	}
}
