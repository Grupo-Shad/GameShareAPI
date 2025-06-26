import express from "express";
import RouterGames from "./router/games.router.js";

class Server {
  #port;
  #persistencia;

  constructor(port, persistencia) {
    this.#port = port;
    this.persistencia = persistencia;
  }
  start() {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/api/games", new RouterGames(this.#persistencia).start());
    const PORT = this.#port;
    const server = app.listen(PORT, () =>
      console.log(`Servidor express escuchando en http://localhost:${PORT}`)
    );
    server.on("error", (error) => console.log("Error en el servidor:" + error));
  }
}

export default Server;
