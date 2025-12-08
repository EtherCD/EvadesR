import { keyboardEvents } from "./events/keyboard";
import { mouseEvents } from "./events/mouse";
import { useAuthStore } from "../stores/auth";
import { useGameStore } from "../stores/game";
import { config } from "../config";
import { FormatEncoder } from "shared";
import { Compress } from "./compress";

export class WebSocketConnection {
  private ws?: WebSocket;

  open: boolean = false;
  reason: string = "";

  kBPerPackage = 0;
  kBPerSecond = 0;
  rawPPS = 0;
  packagesPerSecond = 0;

  disconnect() {
    if (this.open) {
      this.ws!.close();
    }
  }

  sendMessage(msg: string) {
    if (this.open) {
      this.ws!.send(
        JSON.stringify({
          message: msg,
        })
      );
    }
  }

  connect() {
    this.ws = new WebSocket(config.api.replace("http", "ws") + "/server");
    this.ws.binaryType = "arraybuffer";
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
    this.ws.onclose = (event) => {
      this.open = false;
      if (event.reason.length === 0) {
        useGameStore.setState({ reason: "Server disconnected you" });
        return;
      }
      let reason = JSON.parse(event.reason);
      useGameStore.setState({ reason });
    };
    this.ws.onerror = () => {
      this.open = false;
    };
    this.ws.onmessage = this.onMessage;

    setInterval(() => {
      this.kBPerSecond = Math.round((this.kBPerPackage / 1024) * 10) / 10;
      this.kBPerPackage = 0;
      this.packagesPerSecond = this.rawPPS;
      this.rawPPS = 0;
    }, 1000);
  }

  link() {
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

  private onMessage = (event: MessageEvent) => {
    const uint8 = new Uint8Array(event.data);
    this.kBPerPackage += uint8.byteLength;
    const gData = FormatEncoder.decode(Compress.decode(uint8)) as Array<
      Record<string, any>
    >;
    const gameService = useGameStore.getState();
    this.rawPPS++;

    for (const d in gData) {
      const data = gData[d];
      switch (Object.keys(data)[0]) {
        case "message":
          gameService.message(data.message);
          break;
        case "players":
          gameService.uplayers(data.players);
          break;
        case "self":
          gameService.self(data.self);
          break;
        case "areaInit":
          gameService.areaInit(data.areaInit);
          break;
        case "newPlayer":
          gameService.newPlayer(data.newPlayer);
          break;
        case "closePlayer":
          gameService.closePlayer(data.closePlayer);
          break;
        case "updatePlayers":
          gameService.updatePlayers(data.updatePlayers);
          break;
        case "newEntities":
          gameService.newEntities(data.newEntities);
          break;
        case "updateEntities":
          console.log(data.updateEntities);
          gameService.updateEntities(data.updateEntities);
          break;
        case "closeEntities":
          gameService.closeEntities(data.closeEntities);
          break;
      }
    }
  };
}

export const webSocketConnection = new WebSocketConnection();
