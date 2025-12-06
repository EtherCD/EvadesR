import { AuthenticationService } from "./auth";
import { WebSocketService } from "./websocket";

export class Services {
	public static init() {
		AuthenticationService.authenticate();
	}

	public static initGame() {
		WebSocketService.connect();
		WebSocketService.link();
	}

	public static deInitGame() {
		WebSocketService.disconnect();
	}
}
