import CnxMongoDB from "../DBMongo.js";
import { GameModel } from "./models/games.js";

class GamesMongoDb {
  constructor() {}

  getGames = async () => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");
    const games = await GameModel.find();
    return games;
  };
  getGame = async (id) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");
    const game = await GameModel.findOne({ _id: id });
    return game || null;
  };

  saveGame = async (game) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");
    const gameToAdd = new GameModel(game);
    await gameToAdd.save();
    return gameToAdd;
  };

  updateGame = async (id, gameData) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");
    await GameModel.updateOne({ _id: id }, { $set: gameData });
    const gameActualizado = await this.getGame(id);
    return gameActualizado;
  };

  deleteGame = async (id) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");
    const gameBorrado = await this.getGame(id);
    await GameModel.deleteOne({ _id: id });
    return gameBorrado;
  };

  searchGames = async (query) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    const games = await GameModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { publisher: { $regex: query, $options: "i" } },
        { developerStudio: { $regex: query, $options: "i" } },
        { genre: { $in: [new RegExp(query, "i")] } },
      ],
    }).limit(10);

    return games;
  };
}

export default GamesMongoDb;
