import CnxMongoDB from "../DBMongo.js";
import { UserModel } from "./models/user.js";

class UsersMongoDb {
  constructor() {}

  getUserByUsername = async (username) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    const user = await UserModel.findOne({ username: username });
    return user || null;
  };

  saveUser = async (userData) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    const userToAdd = new UserModel(userData);
    await userToAdd.save();
    return userToAdd;
  };

  searchUsers = async (query) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    const users = await UserModel.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    })
      .select("-firebaseUid")
      .limit(10);

    return users;
  };

  getUserByFirebaseUid = async (firebaseUid) => {
    if (!CnxMongoDB.connectionOK)
      throw new Error("Error al conectar con la bd.");

    const user = await UserModel.findOne({ firebaseUid: firebaseUid });
    return user || null;
  };
}

export default UsersMongoDb;
