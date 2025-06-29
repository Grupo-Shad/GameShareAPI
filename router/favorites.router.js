import express from "express";
import FavoritesController from "../controlador/favorites.controller.js";
import { validateFavorites } from "../servicio/validaciones/favorites.validator.js";

class FavoritesRouter {
  #controlador;
  constructor(persistencia) {
    this.#controlador = new FavoritesController(persistencia);
  }

  start() {
    const router = express.Router();
    router.get("/:userId", this.#controlador.getFavorites);
    router.post("/toggle", validateFavorites, this.#controlador.toggleFavorite);
    return router;
  }
}

export default FavoritesRouter;