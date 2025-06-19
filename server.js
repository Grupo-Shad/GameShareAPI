import express from "express";
import RouterLibros from "./router/libros.js";

class Server {
  #port;
  #persistencia;

  constructor(port, persistencia) {
    this.#port = port;
    this.persistencia = persistencia;
  }
  start() {
    const app = express();

    app.use(express.static("public"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/api/libros", new RouterLibros(this.#persistencia).start());
    const PORT = this.#port;
    const server = app.listen(PORT, () =>
      console.log(`Servidor express escuchando en http://localhost:${PORT}`)
    );
    server.on("error", (error) => console.log("Error en el servidor:" + error));
  }
}

export default Server;
