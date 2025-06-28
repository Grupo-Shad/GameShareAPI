import GamesMem from "./gamesMem.js";

class GamesFactory {
  static get(tipo) {
    switch (tipo) {
      case "MEM":
        return new GamesMem();
      default:
        return new GamesMem();
    }
  }
}

export default GamesFactory; 