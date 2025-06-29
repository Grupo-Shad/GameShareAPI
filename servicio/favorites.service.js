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

  addFavorite = async (userId, gameId) => {
    const favorites = await this.getFavorites(userId);
    if (favorites.includes(gameId)) {
      throw new Error("El juego ya está en favoritos");
    } else {
      const favorite = await this.#favoritesDao.addFavorite(userId, gameId)
      return favorite
    }
  }
}

export default FavoritesService;