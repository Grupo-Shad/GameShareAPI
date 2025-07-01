import FavoritesDao from "./favoritesDAO.js";
import FavoritesMongoDb from "./favoritesMongoDb.js";

class FavoritesFactory {
  static get(tipo) {
    switch (tipo) {
      case "MEM":
        return new FavoritesDao();
      case "MONGODB":
        return new FavoritesMongoDb();
      default:
        return new FavoritesMongoDb();
    }
  }
}

export default FavoritesFactory; 