import { Game } from "@core";
import { logger } from "./services/logger";
import { Network } from "@network";
import { Env } from "./services/env";

logger.info(`
 ____  _  _   __   ____  ____  ____    ____       
(  __)/ )( \\ / _\\ (    \\(  __)/ ___)  (  _ \\      
 ) _) \\ \\/ //    \\ ) D ( ) _) \\___ \\   )   /      
(____) \\__/ \\_/\\_/(____/(____)(____/  (__\\_)      
  `);

const game = new Game();
const network = new Network();

setInterval(() => {
	game.update(network.wss.clients);
}, 1000 / Env.tickRate);
