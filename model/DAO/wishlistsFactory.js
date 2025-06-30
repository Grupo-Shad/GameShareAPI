import WishlistsMongoDb from "./wishlistsMongoDb.js";

class WishlistsFactory {
  static get(tipo) {
    switch (tipo) {
      case "MONGODB":
        return new WishlistsMongoDb();
      default:
        return new WishlistsMongoDb();
    }
  }
}

export default WishlistsFactory;
