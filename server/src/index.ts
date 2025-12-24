import { logger } from "./services/logger";
import { Network } from "./network";
import { Env } from "./services/env";
import { Core } from "./core";

logger.info(`
   ___   ____                               
  / _ | / / /__  _____ _______ ___   _______
 / __ |/ / __/ |/ / -_) __(_-</ -_) / __(_-<
/_/ |_/_/\\__/|___/\\__/_/ /___/\\__/ /_/ /___/
                                            
`);

const core = new Core();
const network = new Network();

const tick = () => {
  for (const [index, client] of network.wss.clients) {
    core.input(index, client.getUserData().input);
  }
  core.tick();
  network.wss.tick();
  setTimeout(tick, 1000 / Env.tickRate);
};
tick();
