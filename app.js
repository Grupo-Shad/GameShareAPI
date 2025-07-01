
//import CnxMongoDB from "./model/DBMongo.js"; LO SAQUE PORQUE NO ES NECESARIO YA QUE LA CONEXION TA EN EL SV
import config from "./config.js";
import Server from "./server.js";
/* Lo lleve a SV
if (config.MODO_PERSISTENCIA == "MONGODB") {
  await CnxMongoDB.conectar();
}*/
new Server(config.PORT, config.MODO_PERSISTENCIA).start();
