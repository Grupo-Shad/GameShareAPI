import express from "express";
import GamesController from "../controlador/games.controller.js";

class GamesRouter {
  #controlador;
  constructor(persistencia) {
    this.#controlador = new GamesController(persistencia);
  }

  start() {
    const router = express.Router();
    router.get("/featured", this.#controlador.getFeaturedGames);
    router.get("/:id?", this.#controlador.getGames);
    router.post("/", this.#controlador.saveGame);
    router.put("/:id", this.#controlador.updateGame);
    router.delete("/:id", this.#controlador.deleteGame);
    return router;
  }
}

export default GamesRouter;
