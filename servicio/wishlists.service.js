import WishlistsFactory from "../model/DAO/wishlistsFactory.js";

class WishlistsService {
  #model;

  constructor(persistencia) {
    this.#model = WishlistsFactory.get(persistencia);
  }

  getWishlists = async (firebaseUid) => {
    const wishlists = await this.#model.getWishlists(firebaseUid);

    const formattedWishlists = [];

    for (const wishlist of wishlists) {
      const ownerInfo = await this.#model.getUserByFirebaseUid(wishlist.owner);

      formattedWishlists.push({
        id: wishlist._id,
        title: wishlist.title,
        description: wishlist.description,
        owner: {
          firebaseUid: wishlist.owner,
          username: ownerInfo?.username || "Usuario desconocido",
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

    return {
      id: wishlist._id,
      title: wishlist.title,
      description: wishlist.description,
      owner: {
        firebaseUid: wishlist.owner,
        username: ownerInfo?.username || "Usuario desconocido",
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
          username: userInfo?.username || "Usuario desconocido",
          avatar: userInfo?.avatar || null,
        },
        sharedAt: shareItem.sharedAt,
      });
    }
    return formattedSharedWith;
  };

  createWishlist = async (title, description, firebaseUid) => {
    const wishlistData = {
      title,
      description,
      owner: firebaseUid,
      games: [],
      sharedWith: [],
    };

    const savedWishlist = await this.#model.saveWishlist(wishlistData);

    const ownerInfo = await this.#model.getUserByFirebaseUid(firebaseUid);
    return {
      id: savedWishlist._id,
      title: savedWishlist.title,
      description: savedWishlist.description,
      owner: {
        firebaseUid: firebaseUid,
        username: ownerInfo?.username || "Usuario desconocido",
        avatar: ownerInfo?.avatar || null,
      },
      games: [],
      isOwner: true,
      createdAt: savedWishlist.createdAt,
      updatedAt: savedWishlist.updatedAt,
    };
  };

  addGameToWishlist = async (wishlistId, gameId, notes, firebaseUid) => {
    const wishlist = await this.#model.getWishlist(wishlistId);
    if (!wishlist) {
      throw new Error("Wishlist no encontrada");
    }

    if (wishlist.owner !== firebaseUid) {
      throw new Error("Solo el owner puede agregar juegos");
    }

    const gameExists = wishlist.games.some(
      (gameItem) => gameItem.game._id.toString() === gameId
    );

    if (gameExists) {
      throw new Error("El juego ya existe en la wishlist");
    }

    const gameData = {
      game: gameId,
      notes: notes || "",
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
    const wishlist = await this.#model.getWishlist(wishlistId);
    if (!wishlist) {
      throw new Error("Wishlist no encontrada");
    }

    if (wishlist.owner !== firebaseUid) {
      throw new Error("Solo el owner puede eliminar juegos");
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
          username: userInfo?.username || "Usuario desconocido",
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
    const wishlist = await this.#model.getWishlist(wishlistId);
    if (!wishlist) {
      throw new Error("Wishlist no encontrada");
    }

    if (wishlist.owner !== firebaseUid) {
      throw new Error("Solo el owner puede revocar acceso");
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
          username: userInfo?.username || "Usuario desconocido",
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
