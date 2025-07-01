import CnxMongoDB from "../DBMongo.js";
import { FavoriteModel } from "./models/favorites.js";

class FavoritesMongoDb {
  constructor() {}

  getFavorites = async (userId) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    const userFavorites = await FavoriteModel.findOne({ userId: userId })
      .populate("favorites", "name releaseDate publisher availablePlatforms developerStudio genre featured imageUrl score description");

    return userFavorites ? userFavorites.favorites : [];
  };

  addFavorite = async (userId, gameId) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    const userFavorites = await FavoriteModel.findOne({ userId: userId });
    
    if (userFavorites) {
      if (!userFavorites.favorites.includes(gameId)) {
        await FavoriteModel.updateOne(
          { userId: userId },
          { $push: { favorites: gameId } }
        );
      }
    } else {
      const newFavorites = new FavoriteModel({
        userId: userId,
        favorites: [gameId]
      });
      await newFavorites.save();
    }

    return await this.getFavorites(userId);
  };

  removeFavorite = async (userId, gameId) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    await FavoriteModel.updateOne(
      { userId: userId },
      { $pull: { favorites: gameId } }
    );

    return await this.getFavorites(userId);
  };

  getFavoriteIds = async (userId) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    const userFavorites = await FavoriteModel.findOne({ userId: userId });
    return userFavorites ? userFavorites.favorites : [];
  };
}

export default FavoritesMongoDb; 