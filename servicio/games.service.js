import GamesFactory from "../model/DAO/gamesFactory.js";

class GamesService {
  #model;

  constructor(persistencia) {
    this.#model = GamesFactory.get(persistencia);
  }

  getGames = async (id) => {
    if (id) {
      const game = await this.#model.getGame(id);
      return game;
    } else {
      const games = await this.#model.getGames();
      return games;
    }
  };

  getFeaturedGames = async () => {
    const games = await this.#model.getGames();
    return games.filter((game) => game.featured);
  };

  saveGame = async (game) => {
    const savedGame = await this.#model.saveGame(game);
    return savedGame;
  };

  updateGame = async (id, gameData) => {
    const updatedGame = await this.#model.updateGame(id, gameData);
    return updatedGame;
  };

  deleteGame = async (id) => {
    const deletedGame = await this.#model.deleteGame(id);
    return deletedGame;
  };

  searchGames = async (query) => {
    if (!query || query.trim().length < 2) {
      throw new Error("La búsqueda debe tener al menos 2 caracteres");
    }

    const games = await this.#model.searchGames(query.trim());
    return games;
  };
}

export default GamesService;
