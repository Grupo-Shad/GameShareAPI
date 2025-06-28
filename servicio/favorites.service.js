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
}

export default FavoritesService;