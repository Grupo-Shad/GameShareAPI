import CnxMongoDB from "../DBMongo.js";
import { WishlistModel } from "./models/wishlist.js";
import { UserModel } from "./models/user.js";

class WishlistsMongoDb {
  constructor() {}

  getWishlists = async (firebaseUid) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    const wishlists = await WishlistModel.find({
      $or: [{ owner: firebaseUid }, { "sharedWith.user": firebaseUid }],
    }).populate("games.game", "name imageUrl genre");

    return wishlists;
  };

  getWishlist = async (id) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    const wishlist = await WishlistModel.findOne({ _id: id }).populate(
      "games.game",
      "name imageUrl genre"
    );

    return wishlist || null;
  };

  saveWishlist = async (wishlistData) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    const wishlistToAdd = new WishlistModel(wishlistData);
    await wishlistToAdd.save();

    // Retornamos con populate
    return await this.getWishlist(wishlistToAdd._id);
  };

  updateWishlist = async (id, wishlistData) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    await WishlistModel.updateOne({ _id: id }, { $set: wishlistData });
    return await this.getWishlist(id);
  };

  deleteWishlist = async (id) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    const wishlistBorrada = await this.getWishlist(id);
    await WishlistModel.deleteOne({ _id: id });
    return wishlistBorrada;
  };

  addGameToWishlist = async (wishlistId, gameData) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    await WishlistModel.updateOne(
      { _id: wishlistId },
      { $push: { games: gameData } }
    );

    return await this.getWishlist(wishlistId);
  };

  removeGameFromWishlist = async (wishlistId, gameId) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    await WishlistModel.updateOne(
      { _id: wishlistId },
      { $pull: { games: { game: gameId } } }
    );

    return await this.getWishlist(wishlistId);
  };

  shareWishlist = async (wishlistId, shareData) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    await WishlistModel.updateOne(
      { _id: wishlistId },
      { $push: { sharedWith: shareData } }
    );

    return await this.getWishlist(wishlistId);
  };

  unshareWishlist = async (wishlistId, userId) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    await WishlistModel.updateOne(
      { _id: wishlistId },
      { $pull: { sharedWith: { user: userId } } }
    );

    return await this.getWishlist(wishlistId);
  };

  getUserByUsername = async (username) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    const user = await UserModel.findOne({ username: username });
    return user || null;
  };

  getUserById = async (userId) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    const user = await UserModel.findOne({ _id: userId });
    return user || null;
  };

  getUserByFirebaseUid = async (firebaseUid) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    const user = await UserModel.findOne({ firebaseUid: firebaseUid });
    return user || null;
  };
}

export default WishlistsMongoDb;
