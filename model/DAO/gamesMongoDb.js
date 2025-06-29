import CnxMongoDB from "../DBMongo";
import { GameModel } from "./models/games";

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
    const game = await GameModel.findOne({ id: id });
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
    await GameModel.updateOne({ id: id }, { $set: gameData });
    const gameActualizado = await this.getGame(id);
    return gameActualizado;
  };

  deleteGame = async (id) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");
    const gameBorrado = await this.getGame(id);
    await GameModel.deleteOne({ id: id });
    return gameBorrado;
  };
}

export default GamesMongoDb;
