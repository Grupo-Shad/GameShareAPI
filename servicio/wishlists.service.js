import WishlistsFactory from "../model/DAO/wishlistsFactory.js";

class WishlistsService {
  #model;

  constructor(persistencia) {
    this.#model = WishlistsFactory.get(persistencia);
  }

  getWishlists = async (firebaseUid) => {
    if (!firebaseUid) {
      throw new Error("firebaseUid es requerido");
    }

    const wishlists = await this.#model.getWishlists(firebaseUid);

    const formattedWishlists = [];

    for (const wishlist of wishlists) {
      const ownerInfo = await this.#model.getUserByFirebaseUid(wishlist.owner);

      if (!ownerInfo) {
        console.warn(
          `Wishlist ${wishlist._id} tiene owner inexistente: ${wishlist.owner}`
        );
      }

      formattedWishlists.push({
        id: wishlist._id,
        title: wishlist.title,
        description: wishlist.description,
        owner: {
          firebaseUid: wishlist.owner,
          username: ownerInfo?.username || "Usuario eliminado",
          avatar: ownerInfo?.avatar || null,
        },
        games: wishlist.games.map((gameItem) => ({
          id: gameItem.game._id,
          title: gameItem.game.name,
          cover: gameItem.game.imageUrl,
          genre: gameItem.game.genre,
          notes: gameItem.notes,
          addedAt: gameItem.addedAt,
        })),
        isOwner: wishlist.owner === firebaseUid,
        createdAt: wishlist.createdAt,
        updatedAt: wishlist.updatedAt,
      });
    }

    return formattedWishlists;
  };

  getWishlistById = async (wishlistId, firebaseUid) => {
    if (!wishlistId) {
      throw new Error("wishlistId es requerido");
    }

    if (!firebaseUid) {
      throw new Error("firebaseUid es requerido");
    }

    const wishlist = await this.#model.getWishlist(wishlistId);

    if (!wishlist) {
      throw new Error("Wishlist no encontrada");
    }

    const hasAccess =
      wishlist.owner === firebaseUid ||
      wishlist.sharedWith.some((share) => share.user === firebaseUid);

    if (!hasAccess) {
      throw new Error("No tienes acceso a esta wishlist");
    }

    const ownerInfo = await this.#model.getUserByFirebaseUid(wishlist.owner);

    if (!ownerInfo) {
      console.warn(
        `Wishlist ${wishlist._id} tiene owner inexistente: ${wishlist.owner}`
      );
    }

    return {
      id: wishlist._id,
      title: wishlist.title,
      description: wishlist.description,
      owner: {
        firebaseUid: wishlist.owner,
        username: ownerInfo?.username || "Usuario eliminado",
        avatar: ownerInfo?.avatar || null,
      },
      games: wishlist.games.map((gameItem) => ({
        id: gameItem.game._id,
        title: gameItem.game.name,
        cover: gameItem.game.imageUrl,
        genre: gameItem.game.genre,
        notes: gameItem.notes,
        addedAt: gameItem.addedAt,
      })),
      sharedWith: await this.formatSharedWith(wishlist.sharedWith),
      isOwner: wishlist.owner === firebaseUid,
      shareableId: wishlist.shareableId,
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt,
    };
  };

  formatSharedWith = async (sharedWithArray) => {
    const formattedSharedWith = [];
    for (const shareItem of sharedWithArray) {
      const userInfo = await this.#model.getUserByFirebaseUid(shareItem.user);
      formattedSharedWith.push({
        user: {
          firebaseUid: shareItem.user,
          username: userInfo?.username || "Usuario eliminado",
          avatar: userInfo?.avatar || null,
        },
        sharedAt: shareItem.sharedAt,
      });
    }
    return formattedSharedWith;
  };

  createWishlist = async (title, description, firebaseUid) => {
    if (!title) {
      throw new Error("Title es requerido");
    }

    if (!firebaseUid) {
      throw new Error("firebaseUid es requerido");
    }
    const ownerInfo = await this.#model.getUserByFirebaseUid(firebaseUid);
    if (!ownerInfo) {
      throw new Error("Usuario no encontrado en el sistema");
    }

    if (typeof title !== "string" || title.trim().length === 0) {
      throw new Error("Title debe ser un texto válido");
    }

    if (title.trim().length > 100) {
      throw new Error("Title no puede tener más de 100 caracteres");
    }

    if (description && description.length > 500) {
      throw new Error("Description no puede tener más de 500 caracteres");
    }

    const wishlistData = {
      title: title.trim(),
      description: description?.trim() || "",
      owner: firebaseUid,
      games: [],
      sharedWith: [],
    };

    const savedWishlist = await this.#model.saveWishlist(wishlistData);

    return {
      id: savedWishlist._id,
      title: savedWishlist.title,
      description: savedWishlist.description,
      owner: {
        firebaseUid: firebaseUid,
        username: ownerInfo.username,
        avatar: ownerInfo.avatar || null,
      },
      games: [],
      isOwner: true,
      createdAt: savedWishlist.createdAt,
      updatedAt: savedWishlist.updatedAt,
    };
  };

  deleteWishlist = async (wishlistId, firebaseUid) => {
    if (!wishlistId) {
      throw new Error("wishlistId es requerido");
    }

    if (!firebaseUid) {
      throw new Error("firebaseUid es requerido");
    }

    const wishlist = await this.#model.getWishlist(wishlistId);
    if (!wishlist) {
      throw new Error("Wishlist no encontrada");
    }

    if (wishlist.owner !== firebaseUid) {
      throw new Error("Solo el owner puede eliminar wishlists");
    }

    await this.#model.deleteWishlist(wishlistId);

    return {
      message: "Wishlist eliminada exitosamente",
    };
  };

  addGameToWishlist = async (wishlistId, gameId, notes, firebaseUid) => {
    if (!wishlistId) {
      throw new Error("wishlistId es requerido");
    }

    if (!gameId) {
      throw new Error("gameId es requerido");
    }

    if (!firebaseUid) {
      throw new Error("firebaseUid es requerido");
    }

    const wishlist = await this.#model.getWishlist(wishlistId);
    if (!wishlist) {
      throw new Error("Wishlist no encontrada");
    }

    if (wishlist.owner !== firebaseUid) {
      throw new Error("Solo el owner puede agregar juegos");
    }

    const game = await this.#model.getGame(gameId);
    if (!game) {
      throw new Error("Juego no encontrado");
    }

    const gameExists = wishlist.games.some(
      (gameItem) => gameItem.game._id.toString() === gameId
    );

    if (gameExists) {
      throw new Error("El juego ya existe en la wishlist");
    }

    if (notes && notes.length > 200) {
      throw new Error("Las notas no pueden tener más de 200 caracteres");
    }

    const gameData = {
      game: gameId,
      notes: notes?.trim() || "",
      addedAt: new Date(),
    };

    const updatedWishlist = await this.#model.addGameToWishlist(
      wishlistId,
      gameData
    );

    return {
      message: "Juego agregado exitosamente",
      games: updatedWishlist.games.map((gameItem) => ({
        id: gameItem.game._id,
        title: gameItem.game.name,
        cover: gameItem.game.imageUrl,
        genre: gameItem.game.genre,
        notes: gameItem.notes,
        addedAt: gameItem.addedAt,
      })),
    };
  };

  removeGameFromWishlist = async (wishlistId, gameId, firebaseUid) => {
    if (!wishlistId) {
      throw new Error("wishlistId es requerido");
    }

    if (!gameId) {
      throw new Error("gameId es requerido");
    }

    if (!firebaseUid) {
      throw new Error("firebaseUid es requerido");
    }

    const wishlist = await this.#model.getWishlist(wishlistId);
    if (!wishlist) {
      throw new Error("Wishlist no encontrada");
    }

    if (wishlist.owner !== firebaseUid) {
      throw new Error("Solo el owner puede eliminar juegos");
    }

    const gameExists = wishlist.games.some(
      (gameItem) => gameItem.game._id.toString() === gameId
    );

    if (!gameExists) {
      throw new Error("El juego no existe en la wishlist");
    }

    const updatedWishlist = await this.#model.removeGameFromWishlist(
      wishlistId,
      gameId
    );

    return {
      message: "Juego eliminado exitosamente",
      games: updatedWishlist.games.map((gameItem) => ({
        id: gameItem.game._id,
        title: gameItem.game.name,
        cover: gameItem.game.imageUrl,
        genre: gameItem.game.genre,
        notes: gameItem.notes,
        addedAt: gameItem.addedAt,
      })),
    };
  };

  shareWishlist = async (wishlistId, targetUserId, firebaseUid) => {
    if (!wishlistId) {
      throw new Error("wishlistId es requerido");
    }

    if (!targetUserId) {
      throw new Error("targetUserId es requerido");
    }

    if (!firebaseUid) {
      throw new Error("firebaseUid es requerido");
    }

    const wishlist = await this.#model.getWishlist(wishlistId);
    if (!wishlist) {
      throw new Error("Wishlist no encontrada");
    }

    if (wishlist.owner !== firebaseUid) {
      throw new Error("Solo el owner puede compartir wishlists");
    }

    const targetUser = await this.#model.getUserById(targetUserId);
    if (!targetUser) {
      throw new Error("Usuario no encontrado");
    }

    if (targetUser.firebaseUid === firebaseUid) {
      throw new Error("No puedes compartir wishlist contigo mismo");
    }

    const alreadyShared = wishlist.sharedWith.some(
      (shareItem) => shareItem.user === targetUser.firebaseUid
    );

    if (alreadyShared) {
      throw new Error("La wishlist ya está compartida con este usuario");
    }

    const shareData = {
      user: targetUser.firebaseUid,
      sharedAt: new Date(),
    };

    const updatedWishlist = await this.#model.shareWishlist(
      wishlistId,
      shareData
    );

    const sharedWithFormatted = [];
    for (const shareItem of updatedWishlist.sharedWith) {
      const userInfo = await this.#model.getUserByFirebaseUid(shareItem.user);
      sharedWithFormatted.push({
        user: {
          firebaseUid: shareItem.user,
          username: userInfo?.username || "Usuario eliminado",
          avatar: userInfo?.avatar || null,
        },
        sharedAt: shareItem.sharedAt,
      });
    }

    return {
      message: "Wishlist compartida exitosamente",
      sharedWith: sharedWithFormatted,
    };
  };

  unshareWishlist = async (wishlistId, targetFirebaseUid, firebaseUid) => {
    if (!wishlistId) {
      throw new Error("wishlistId es requerido");
    }

    if (!targetFirebaseUid) {
      throw new Error("targetFirebaseUid es requerido");
    }

    if (!firebaseUid) {
      throw new Error("firebaseUid es requerido");
    }

    const wishlist = await this.#model.getWishlist(wishlistId);
    if (!wishlist) {
      throw new Error("Wishlist no encontrada");
    }

    if (wishlist.owner !== firebaseUid) {
      throw new Error("Solo el owner puede revocar acceso");
    }

    const hasAccess = wishlist.sharedWith.some(
      (shareItem) => shareItem.user === targetFirebaseUid
    );

    if (!hasAccess) {
      throw new Error("El usuario no tiene acceso a esta wishlist");
    }

    const updatedWishlist = await this.#model.unshareWishlist(
      wishlistId,
      targetFirebaseUid
    );

    const sharedWithFormatted = [];
    for (const shareItem of updatedWishlist.sharedWith) {
      const userInfo = await this.#model.getUserByFirebaseUid(shareItem.user);
      sharedWithFormatted.push({
        user: {
          firebaseUid: shareItem.user,
          username: userInfo?.username || "Usuario eliminado",
          avatar: userInfo?.avatar || null,
        },
        sharedAt: shareItem.sharedAt,
      });
    }

    return {
      message: "Acceso revocado exitosamente",
      sharedWith: sharedWithFormatted,
    };
  };
}

export default WishlistsService;
