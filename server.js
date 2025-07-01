import express from "express";
import RouterGames from "./router/games.router.js";
import FavoritesRouter from "./router/favorites.router.js";
import WishlistsRouter from "./router/wishlists.router.js";
import UsersRouter from "./router/users.router.js";
import cors from "cors";
//IMPORTE PORQUE AHORA LO TENGO ACA
import CnxMongoDB from "./model/DBMongo.js";
import { authenticateFirebase } from "./middlewares/firebaseAuth.js";

const CORS_ORIGINS = [
  process.env.CORS_LOCALHOST,
  process.env.CORS_ANDROID_EMULATOR,
  process.env.CORS_EXPO_APP,
  process.env.FRONTEND_URL,
].filter(Boolean);

class Server {
  #port;
  #persistencia;
  //Para hacer el stop
  #server;


  constructor(port, persistencia) {
    this.#port = port;
    this.persistencia = persistencia;
    this.#server = null;
  }
  async start() {
    const app = express();

    app.use(
      cors({
        origin: CORS_ORIGINS,
        credentials: true,
      })
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Rutas públicas (sin autenticación)
    app.use("/api/users", new UsersRouter(this.#persistencia).start());

    // Rutas que requieren autenticación
    app.use(
      "/api/games",
      authenticateFirebase,
      new RouterGames(this.#persistencia).start()
    );
    app.use(
      "/api/wishlists",
      authenticateFirebase,
      new WishlistsRouter(this.#persistencia).start()
    );
    app.use("/api/favorites", new FavoritesRouter(this.#persistencia).start());

    //LO QUE TRAJE DE APP CONECTO LA BASE DE DATOS AL SERVCIO
    if (this.#persistencia.MODO_PERSISTENCIA == "MONGODB") {
    await CnxMongoDB.conectar();
    };
    const PORT = this.#port;
    //Uso #server en vez de la constante
    this.#server = app.listen(PORT, "0.0.0.0", () =>
      console.log(`Servidor express escuchando en http://0.0.0.0:${PORT}`)
    );
    this.#server.on("error", (error) => console.log("Error en el servidor:" + error));
     
    //Para las pruebas internas
    return app;
  }
  //Para que no genere problemas a la hora de hacer testing cierro el SV y la BD ya que hay procesos que pueden resultar bloqueados
  async stop(){
    if(this.#server){
      this.#server.close();
      await CnxMongoDB.desconectar()
      this.#server = null;
    }
  }
}

export default Server;
