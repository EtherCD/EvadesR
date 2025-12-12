import { logger } from "./services/logger";
import { Network } from "./network";
import { Env } from "./services/env";
import { Core } from "./core";

logger.info(`
 ____  _  _   __   ____  ____  ____    ____       
(  __)/ )( \\ / _\\ (    \\(  __)/ ___)  (  _ \\      
 ) _) \\ \\/ //    \\ ) D ( ) _) \\___ \\   )   /      
(____) \\__/ \\_/\\_/(____/(____)(____/  (__\\_)      
  `);

const core = new Core();
const network = new Network();

setInterval(() => {
  for (const [index, client] of network.wss.clients) {
    core.input(index, client.getUserData().input);
  }
  core.tick();

  network.wss.tick();
}, 1000 / Env.tickRate);
