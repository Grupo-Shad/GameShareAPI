import GamesService from "../servicio/games.service.js";

class GamesController {
  #service;

  constructor(persistencia) {
    this.#service = new GamesService(persistencia);
  }

  getGames = async (req, res) => {
    try {
      const { id } = req.params;
      const games = await this.#service.getGames(id);

      if (id && games === null) {
        return res.status(404).json({ error: "Game not found" });
      }

      res.json(games);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getFeaturedGames = async (req, res) => {
    try {
      const featuredGames = await this.#service.getFeaturedGames();
      res.json(featuredGames);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  saveGame = async (req, res) => {
    try {
      const game = req.body;
      const savedGame = await this.#service.saveGame(game);
      res.status(201).json(savedGame);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  updateGame = async (req, res) => {
    try {
      const { id } = req.params;
      const gameData = req.body;
      const updatedGame = await this.#service.updateGame(id, gameData);

      res
        .status(updatedGame ? 200 : 404)
        .json(updatedGame ? updatedGame : { error: "Game not found" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteGame = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedGame = await this.#service.deleteGame(id);

      res
        .status(deletedGame ? 200 : 404)
        .json(deletedGame ? deletedGame : { error: "Game not found" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  searchGames = async (req, res) => {
    try {
      const { q } = req.query;

      if (!q) {
        return res
          .status(400)
          .json({ error: "Parámetro de búsqueda 'q' es requerido" });
      }

      const games = await this.#service.searchGames(q);
      res.json(games);
    } catch (error) {
      if (error.message.includes("al menos 2 caracteres")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  };
}

export default GamesController;
