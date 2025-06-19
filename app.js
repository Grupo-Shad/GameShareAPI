import config from "./config.js";
import Server from "./server.js";
new Server(config.PORT, config.MODO_PERSISTENCIA).start();
