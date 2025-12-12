import napi from "napi";
import { Loader } from "../services/loader";
import { coreEvents } from "../services/events/core";
import { networkEvents } from "../services/events/network";

export class Core {
  game: napi.Game;

  constructor() {
    this.game = new napi.Game(
      new napi.GameProps(Loader.loadConfig(), Loader.loadWorlds())
    );

    coreEvents.on("join", ({ name, id }) => {
      this.game.join(new napi.JoinProps(name, id));
    });

    coreEvents.on("leave", ({ id }) => {
      this.game.leave(id);
    });
  }

  tick() {
    networkEvents.emit("send", this.game.update() as Record<number, Buffer>);
  }

  input(id: number, input: napi.InputProps) {
    this.game.input(id, input);
  }
}
