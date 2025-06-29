import CnxMongoDB from "../DBMongo.js";
import { GameModel } from "./models/games.js";

class GamesMongoDb {
  constructor() {}

  getGames = async () => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");
    const games = await GameModel.find();
    console.log(games);
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
    return game;
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
}

export default GamesMongoDb;
