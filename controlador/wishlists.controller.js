import WishlistsService from "../servicio/wishlists.service.js";

class WishlistsController {
  #service;

  constructor(persistencia) {
    this.#service = new WishlistsService(persistencia);
  }

  getWishlists = async (req, res) => {
    try {
      const firebaseUid = req.user.uid;
      const wishlists = await this.#service.getWishlists(firebaseUid);
      res.json(wishlists);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getWishlistById = async (req, res) => {
    try {
      const { wishlistId } = req.params;
      const firebaseUid = req.user.uid;

      const wishlist = await this.#service.getWishlistById(
        wishlistId,
        firebaseUid
      );
      res.json(wishlist);
    } catch (error) {
      if (error.message === "Wishlist no encontrada") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "No tienes acceso a esta wishlist") {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  };

  createWishlist = async (req, res) => {
    try {
      const { title, description } = req.body;
      const firebaseUid = req.user.uid;
      const wishlist = await this.#service.createWishlist(
        title,
        description,
        firebaseUid
      );
      res.status(201).json(wishlist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  addGameToWishlist = async (req, res) => {
    try {
      const { wishlistId } = req.params;
      const { gameId, notes } = req.body;
      const firebaseUid = req.user.uid;

      if (!gameId) {
        return res.status(400).json({ error: "gameId es requerido" });
      }

      const result = await this.#service.addGameToWishlist(
        wishlistId,
        gameId,
        notes,
        firebaseUid
      );
      res.json(result);
    } catch (error) {
      if (error.message === "Wishlist no encontrada") {
        return res.status(404).json({ error: error.message });
      }
      if (
        error.message === "Solo el owner puede agregar juegos" ||
        error.message === "El juego ya existe en la wishlist"
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  };

  removeGameFromWishlist = async (req, res) => {
    try {
      const { wishlistId, gameId } = req.params;
      const firebaseUid = req.user.uid;

      const result = await this.#service.removeGameFromWishlist(
        wishlistId,
        gameId,
        firebaseUid
      );
      res.json(result);
    } catch (error) {
      if (error.message === "Wishlist no encontrada") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Solo el owner puede eliminar juegos") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  };

  shareWishlist = async (req, res) => {
    try {
      const { wishlistId } = req.params;
      const { targetUserId } = req.body;
      const firebaseUid = req.user.uid;

      const result = await this.#service.shareWishlist(
        wishlistId,
        targetUserId,
        firebaseUid
      );
      res.json(result);
    } catch (error) {
      if (
        error.message === "Wishlist no encontrada" ||
        error.message === "Usuario no encontrado"
      ) {
        return res.status(404).json({ error: error.message });
      }
      if (
        error.message === "Solo el owner puede compartir wishlists" ||
        error.message === "La wishlist ya está compartida con este usuario"
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  };

  unshareWishlist = async (req, res) => {
    try {
      const { wishlistId, targetFirebaseUid } = req.params;
      const firebaseUid = req.user.uid;

      const result = await this.#service.unshareWishlist(
        wishlistId,
        targetFirebaseUid,
        firebaseUid
      );
      res.json(result);
    } catch (error) {
      if (error.message === "Wishlist no encontrada") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Solo el owner puede revocar acceso") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  };
}

export default WishlistsController;
