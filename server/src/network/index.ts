import { App, TemplatedApp } from "uWebSockets.js";
import { WebSocketServer } from "./ws";
import { Env } from "../services/env";
import { logger } from "../services/logger";
import { HTTPServer } from "./http";

export class Network {
	wss: WebSocketServer;
	http: HTTPServer;
	app: TemplatedApp;
	constructor() {
		const app = App();
		this.wss = new WebSocketServer(app);
		this.http = new HTTPServer(app);
		this.app = app;

		app.listen(Env.port, () => {
			logger.info("Server started at port " + Env.port);
		});
	}
}
