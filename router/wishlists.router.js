import express from "express";
import WishlistsController from "../controlador/wishlists.controller.js";
import {
  validarCrearWishlistMiddleware,
  validarAgregarJuegoMiddleware,
  validarCompartirWishlistMiddleware,
  validarEliminarJuegoMiddleware,
} from "../servicio/validaciones/wishlists.js";

class WishlistsRouter {
  #controlador;

  constructor(persistencia) {
    this.#controlador = new WishlistsController(persistencia);
  }

  start() {
    const router = express.Router();

    // GET /wishlists - Obtener wishlists del usuario autenticado
    router.get("/", this.#controlador.getWishlists);

    // GET /wishlists/:wishlistId - Obtener detalle de una wishlist específica
    router.get("/:wishlistId", this.#controlador.getWishlistById);

    // POST /wishlists - Crear nueva wishlist
    router.post(
      "/",
      validarCrearWishlistMiddleware,
      this.#controlador.createWishlist
    );

    // POST /wishlists/:wishlistId/games - Agregar juego a wishlist
    router.post(
      "/:wishlistId/games",
      validarAgregarJuegoMiddleware,
      this.#controlador.addGameToWishlist
    );

    // DELETE /wishlists/:wishlistId/games/:gameId - Eliminar juego de wishlist
    router.delete(
      "/:wishlistId/games/:gameId",
      validarEliminarJuegoMiddleware,
      this.#controlador.removeGameFromWishlist
    );

    // POST /wishlists/:wishlistId/share - Compartir wishlist con usuario
    router.post(
      "/:wishlistId/share",
      validarCompartirWishlistMiddleware,
      this.#controlador.shareWishlist
    );

    // DELETE /wishlists/:wishlistId/share/:targetFirebaseUid - Revocar acceso a usuario
    router.delete(
      "/:wishlistId/share/:targetFirebaseUid",
      this.#controlador.unshareWishlist
    );

    // DELETE /wishlists/:wishlistId - Eliminar wishlist
    router.delete("/:wishlistId", this.#controlador.deleteWishlist);

    return router;
  }
}

export default WishlistsRouter;
