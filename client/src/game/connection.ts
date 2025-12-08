import { keyboardEvents } from "./events/keyboard";
import { mouseEvents } from "./events/mouse";
import { useAuthStore } from "../stores/auth";
import { useGameStore } from "../stores/game";
import { config } from "../config";

export class WebSocketConnection {
  private ws?: WebSocket;

  public open: boolean = false;

  public disconnect() {
    if (this.open) {
      this.ws!.close();
    }
  }

  public sendMessage(msg: string) {
    if (this.open) {
      this.ws!.send(
        JSON.stringify({
          message: msg,
        })
      );
    }
  }

  public connect() {
    this.ws = new WebSocket(config.api.replace("http", "ws") + "/server");
    this.ws.onopen = () => {
      this.ws!.send(
        JSON.stringify({
          init: {
            hero: "",
            session: useAuthStore.getState().token,
          },
        })
      );
      this.open = true;
    };
    this.ws.onclose = () => {
      this.open = false;
    };
    this.ws.onerror = () => {
      this.open = false;
    };
    this.ws.onmessage = this.onMessage;
  }

  public link() {
    mouseEvents.on("move", (event) => {
      if (this.open) {
        this.ws!.send(
          JSON.stringify({
            mousePos: [event.x, event.y],
          })
        );
      }
    });
    mouseEvents.on("enable", (event) => {
      if (this.open) {
        this.ws!.send(
          JSON.stringify({
            mouseEnable: event,
          })
        );
      }
    });
    keyboardEvents.on("down", (key) => {
      if (this.open) {
        if (key === "first" || key === "second") {
          this.ws!.send(
            JSON.stringify({
              ability: key,
            })
          );
        } else if (key.indexOf("upgrade_") === -1)
          this.ws!.send(
            JSON.stringify({
              keyDown: key,
            })
          );
      }
    });

    keyboardEvents.on("up", (key) => {
      if (key.indexOf("upgrade_") === -1)
        this.ws!.send(
          JSON.stringify({
            keyUp: key,
          })
        );
    });
  }

  private onMessage(event: MessageEvent) {
    const gData: Array<{ [key: string]: any }> = JSON.parse(event.data);
    const gameService = useGameStore.getState();
    for (const d in gData) {
      const data = gData[d];
      switch (Object.keys(data)[0]) {
        case "m":
          gameService.message(data.m);
          break;
        case "pls":
          gameService.uplayers(data.pls);
          break;
        case "s":
          gameService.self(data.s);
          break;
        case "ai":
          gameService.areaInit(data.ai);
          break;
        case "np":
          gameService.newPlayer(data.np);
          break;
        case "cp":
          gameService.closePlayer(data.cp);
          break;
        case "p":
          gameService.updatePlayers(data.p);
          break;
        case "ne":
          gameService.newEntities(data.ne);
          break;
        case "ue":
          gameService.updateEntities(data.ue);
          break;
        case "ce":
          gameService.closeEntities(data.ce);
          break;
      }
    }
  }
}

export const webSocketConnection = new WebSocketConnection();
