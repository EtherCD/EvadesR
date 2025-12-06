import { App, TemplatedApp } from "uWebSockets.js";
import { WebSocketServer } from "./ws";
import { Env } from "../services/env";
import { logger } from "../services/logger";

export class Network {
	wss: WebSocketServer;
	app: TemplatedApp;
	constructor() {
		const app = App();
		this.wss = new WebSocketServer(app);
		this.app = app;

		app.listen(Env.port, () => {
			logger.info("Server started at port " + Env.port);
		});
	}
}
