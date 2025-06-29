import express from "express";
import FavoritesController from "../controlador/favorites.controller.js";

class FavoritesRouter {
  #controlador;
  constructor(persistencia) {
    this.#controlador = new FavoritesController(persistencia);
  }

  start() {
    const router = express.Router();
    router.get("/:userId", this.#controlador.getFavorites);
    router.post("/", this.#controlador.addFavorite);
    return router;
  }
}

export default FavoritesRouter;