import { Game } from "./core";
import { logger } from "./services/logger";
import { Network } from "./network";
import { Env } from "./services/env";

logger.info(`
   ___   ____                      
  / _ | / / /__  _____ _______ ___ 
 / __ |/ / __/ |/ / -_) __(_-</ -_)
/_/ |_/_/\\__/|___/\\__/_/ /___/\\__/ 
`);

const game = new Game();
const network = new Network();

setInterval(() => {
  game.update(network.wss.clients);
  network.wss.tick();
}, 1000 / Env.tickRate);
