import { config } from "../../config";
import { AuthenticationService } from "./auth";
import { GameService } from "./game";
import { KeyboardService } from "./keyboard";
import { MouseService } from "./mouse";

export class WebSocketService {
	private static ws: WebSocket;

	public static open: boolean;

	public static disconnect() {
		if (WebSocketService.open) {
			WebSocketService.ws.close();
		}
	}

	public static sendMessage(message: string) {
		if (WebSocketService.open) {
			WebSocketService.ws.send(
				JSON.stringify({
					message,
				})
			);
		}
	}

	public static connect() {
		WebSocketService.ws = new WebSocket(config.serverUrl);
		WebSocketService.ws.onopen = () => {
			console.log("opened");
			WebSocketService.ws.send(
				JSON.stringify({
					init: { name: AuthenticationService.state.username, hero: "", session: "" },
				})
			);
			WebSocketService.open = true;
		};
		WebSocketService.ws.onclose = () => {
			WebSocketService.open = false;
		};
		WebSocketService.ws.onerror = () => {
			WebSocketService.open = false;
		};
		WebSocketService.ws.onmessage = WebSocketService.onMessage;
	}

	public static link() {
		MouseService.emitter.on("move", (event) => {
			if (WebSocketService.open) {
				WebSocketService.ws.send(
					JSON.stringify({
						mousePos: [event.x, event.y],
					})
				);
			}
		});
		MouseService.emitter.on("enable", (event) => {
			if (WebSocketService.open) {
				WebSocketService.ws.send(
					JSON.stringify({
						mouseEnable: event,
					})
				);
			}
		});
		KeyboardService.onEmit("down", (key) => {
			if (WebSocketService.open) {
				if (key === "first" || key === "second") {
					WebSocketService.ws.send(
						JSON.stringify({
							ability: key,
						})
					);
				} else if (key.indexOf("upgrade_") === -1)
					WebSocketService.ws.send(
						JSON.stringify({
							keyDown: key,
						})
					);
			}
		});

		KeyboardService.onEmit("up", (key) => {
			if (key.indexOf("upgrade_") === -1)
				WebSocketService.ws.send(
					JSON.stringify({
						keyUp: key,
					})
				);
		});
	}

	private static onMessage(event: MessageEvent) {
		const data: Record<string, any> = JSON.parse(event.data);
		console.log(data);
		switch (Object.keys(data)[0]) {
			case "m":
				GameService.message(data.m);
				break;
			case "pls":
				GameService.players(data.pls);
				break;
			case "s":
				GameService.self(data.s);
				break;
			case "ai":
				GameService.areaInit(data.ai);
				break;
			case "np":
				GameService.newPlayer(data.np);
				break;
			case "cp":
				GameService.closePlayer(data.cp);
				break;
			case "p":
				GameService.updatePlayers(data.p);
				break;
			case "ne":
				GameService.newEntities(data.ne);
				break;
			case "ue":
				GameService.updateEntities(data.ue);
				break;
			case "ce":
				GameService.closeEntities(data.ce);
				break;
		}
	}
}
