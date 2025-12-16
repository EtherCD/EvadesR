import { Loader } from "../services/loader";
import { coreEvents } from "../services/events/core";
import { networkEvents } from "../services/events/network";
import { ComputeEngine, EngineProps, Input, JoinProps } from "compute/index";

export class Core {
  game: ComputeEngine;

  constructor() {
    this.game = new ComputeEngine(
      new EngineProps(Loader.loadConfig(), Loader.loadWorlds())
    );

    // this.game.onPlayerDeath((id) => {
    //   networkEvents.emit("leave", id);
    //   return null;
    // })

    coreEvents.on("join", ({ name, id }) => {
      this.game.join(new JoinProps(name, id));
    });

    coreEvents.on("leave", ({ id }) => {
      this.game.leave(id);
    });
  }

  tick() {
    networkEvents.emit("send", this.game.update() as Record<number, Buffer>);
  }

  input(id: number, input: Input) {
    this.game.input(id, input);
  }
}
