import { SHARED_COMPRESSOR, TemplatedApp, WebSocket } from "uWebSockets.js";
import { logger } from "../../services/logger";
import { clientMessageValidate } from "../../shared/ws/schema";
import { ClientMessage, Input } from "../../shared/ws/types";
import { networkEvents } from "../../services/events/network";
import { sendToCore } from "./send";
import { KeyUp } from "./handlers/keyup";
import { KeyDown } from "./handlers/keydown";
import { mouseEnable } from "./handlers/mouseenable";
import { mousePos } from "./handlers/mousepos";
import { ability } from "./handlers/ability";
import { database } from "../../services/db";
import { FormatEncoder } from "@shared/schema";
import { Compress } from "server/src/services/compress";

export interface Client {
  id: number;
  input: Input;
  packages: object[];
  username: string;
}

export class WebSocketServer {
  nextId = 0;
  clients = new Map<number, WebSocket<Client>>();
  constructor(app: TemplatedApp) {
    app.ws<Client>("/server", {
      open: (ws) => {
        const data = ws.getUserData();
        data.id = this.nextId++;
        data.input = {};
        data.packages = [];
        data.username = "";
        logger.info(`User connected ${data.id}`);
        this.clients.set(data.id, ws);
      },
      message: async (ws, msg, isBinary) => {
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
                const auth = await database.auth(init.session);
                if (auth === null || auth === undefined) {
                  this.close(ws, "Session expired or corrupted");
                  return;
                }
                const username = auth!.username;
                for (const i of this.clients)
                  if (username === i[1].getUserData().username) {
                    this.close(ws, "You already in game");
                    return;
                  }
                client.username = auth!.username;
                sendToCore.join({
                  name: auth!.username,
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
                ability(ws, data.ability!);
                break;
            }
          }
        } else {
          this.close(ws, "not valid message structure");
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
      const client = this.clients.get(event.id);

      if (client) {
        client.getUserData().packages.push(event.value);
      }
    });
    networkEvents.on("all", (event) => {
      for (const [_, client] of this.clients) {
        client.getUserData().packages.push(event);
      }
    });
    networkEvents.on("close", (event) => {
      const client = this.clients.get(event.id);

      if (client) {
        this.close(client, JSON.stringify({ close: event.reason }));
      }
    });
  }

  close(ws: WebSocket<Client>, reason: string) {
    logger.info(
      "Client " + ws.getUserData().id + " was disconnected by reason " + reason
    );
    ws.end(1000, reason);
  }

  async tick() {
    for (const [_, client] of this.clients) {
      const data = client.getUserData();
      if (data.packages.length != 0)
        client.send(
          await Compress.encode(FormatEncoder.encode(data.packages)),
          true
        );
      data.packages = [];
    }
  }
}
