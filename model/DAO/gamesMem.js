class GamesMem {
  #games;

  constructor() {
    this.#games = [
      {
        id: 1,
        name: "The Legend of Zelda: Breath of the Wild",
        releaseDate: "2017-03-03",
        publisher: "Nintendo",
        availablePlatforms: ["Nintendo Switch", "Wii U"],
        developerStudio: "Nintendo EPD",
        genre: ["Action", "Adventure"],
        featured: true,
        imageUrl:
          "https://www.metacritic.com/a/img/catalog/provider/6/3/6-1-844837-13.jpg",
        score: 97,
        description:
          "An open-world adventure that redefines the Zelda series with incredible freedom and exploration.",
      },
      {
        id: 2,
        name: "Red Dead Redemption 2",
        releaseDate: "2018-10-26",
        publisher: "Rockstar Games",
        availablePlatforms: [
          "PlayStation 4",
          "Xbox One",
          "PC",
          "PlayStation 5",
          "Xbox Series X/S",
        ],
        developerStudio: "Rockstar Studios",
        genre: ["Action", "Adventure"],
        featured: true,
        imageUrl:
          "https://www.metacritic.com/a/img/catalog/provider/6/12/6-1-689098-52.jpg",
        score: 97,
        description:
          "An epic tale of outlaws in the American frontier with stunning detail.",
      },
      {
        id: 3,
        name: "Cyberpunk 2077",
        releaseDate: "2020-12-10",
        publisher: "CD Projekt",
        availablePlatforms: [
          "PC",
          "PlayStation 4",
          "Xbox One",
          "PlayStation 5",
          "Xbox Series X/S",
        ],
        developerStudio: "CD Projekt Red",
        genre: ["RPG"],
        featured: true,
        imageUrl:
          "https://www.metacritic.com/a/img/catalog/provider/7/2/7-1749407617.jpg?auto=webp&fit=cover&height=132&width=88",
        score: 86,
        description:
          "A futuristic RPG set in Night City with immersive cyberpunk aesthetics.",
      },
      {
        id: 4,
        name: "Among Us",
        releaseDate: "2018-06-15",
        publisher: "InnerSloth",
        availablePlatforms: [
          "PC",
          "Mobile",
          "Nintendo Switch",
          "PlayStation 4",
          "PlayStation 5",
          "Xbox One",
          "Xbox Series X/S",
        ],
        developerStudio: "InnerSloth",
        genre: ["Social Deduction"],
        featured: true,
        score: 78,
        description: "A social deduction game that became a global phenomenon.",
      },
      {
        id: 5,
        name: "Minecraft",
        releaseDate: "2011-11-18",
        publisher: "Mojang Studios",
        availablePlatforms: [
          "PC",
          "Mobile",
          "PlayStation 4",
          "Xbox One",
          "Nintendo Switch",
          "PlayStation 5",
          "Xbox Series X/S",
        ],
        developerStudio: "Mojang Studios",
        genre: ["Sandbox"],
        featured: true,
        imageUrl:
          "https://www.metacritic.com/a/img/catalog/provider/6/12/6-1-780942-52.jpg?height=100&width=70",
        score: 90,
        description:
          "The ultimate sandbox game where creativity knows no bounds.",
      },
      {
        id: 6,
        name: "God of War",
        releaseDate: "2018-04-20",
        publisher: "Sony Interactive Entertainment",
        availablePlatforms: ["PlayStation 4", "PlayStation 5"],
        developerStudio: "Santa Monica Studio",
        genre: ["Action", "Adventure"],
        featured: true,
        imageUrl:
          "https://www.metacritic.com/a/img/catalog/provider/6/12/6-1-780942-52.jpg?height=100&width=70",
        score: 94,
        description:
          "A stunning Norse mythology adventure featuring Kratos and his son Atreus.",
      },
    ];
  }

  getGames = async () => this.#games;

  getGame = async (id) => {
    const game = this.#games.find((g) => g.id == id);
    return game || null;
  };

  saveGame = async (game) => {
    game.id = String(
      parseInt(this.#games[this.#games.length - 1]?.id || 0) + 1
    );
    this.#games.push(game);
    return game;
  };

  updateGame = async (id, gameData) => {
    const index = this.#games.findIndex((g) => g.id === id);
    if (index != -1) {
      const oldGame = this.#games[index];
      const updatedGame = { ...oldGame, ...gameData };
      this.#games.splice(index, 1, updatedGame);
      return updatedGame;
    } else {
      return null;
    }
  };

  deleteGame = async (id) => {
    const index = this.#games.findIndex((g) => g.id === id);
    if (index != -1) {
      const game = this.#games.splice(index, 1)[0];
      return game;
    } else {
      return null;
    }
  };
}

export default GamesMem;
