import CnxMongoDB from "./model/DBMongo.js";
import config from "./config.js";
import Server from "./server.js";

if (config.MODO_PERSISTENCIA == "MONGODB") {
  await CnxMongoDB.conectar();
}
new Server(config.PORT, config.MODO_PERSISTENCIA).start();
