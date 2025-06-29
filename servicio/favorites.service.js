import FavoritesDao from "../model/DAO/favoritesDAO.js";

class FavoritesService {
  #favoritesDao;
  constructor(persistencia) {
    this.#favoritesDao = new FavoritesDao();
  }

  getFavorites = async (userId) => {
    const favorites = await this.#favoritesDao.getFavorites(userId)
    return favorites
  }

  toggleFavorite = async (userId, gameId) => {
    const favorites = await this.getFavorites(userId);
    if (favorites.includes(gameId)) {
      return await this.#favoritesDao.removeFavorite(userId, gameId)
    } else {
      return await this.#favoritesDao.addFavorite(userId, gameId)
    }
  }
}

export default FavoritesService;