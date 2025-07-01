import FavoritesFactory from "../model/DAO/favoritesFactory.js";
import GamesService from "./games.service.js";

class FavoritesService {
  #favoritesModel;
  #gamesService;
  
  constructor(persistencia) {
    console.log("persistencia: ", persistencia);
    this.#favoritesModel = FavoritesFactory.get(persistencia);
    this.#gamesService = new GamesService(persistencia);
  }

  getFavorites = async (userId) => {
    const favorites = await this.#favoritesModel.getFavorites(userId);
    return favorites;
  }

  toggleFavorite = async (userId, gameId) => {
    let favoriteIds;
    favoriteIds = await this.#favoritesModel.getFavoriteIds(userId);
    if (favoriteIds.includes(gameId)) {
      return await this.#favoritesModel.removeFavorite(userId, gameId);
    } else {
      return await this.#favoritesModel.addFavorite(userId, gameId);
    }
  }
}

export default FavoritesService;