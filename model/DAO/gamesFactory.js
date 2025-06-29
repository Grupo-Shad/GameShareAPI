import GamesMem from "./gamesMem.js";
import GamesMongoDb from "./gamesMongoDb.js";

class GamesFactory {
  static get(tipo) {
    switch (tipo) {
      case "MEM":
        return new GamesMem();
      case "MONGODB":
        return new GamesMongoDb();
      default:
        return new GamesMongoDb();
    }
  }
}

export default GamesFactory;
