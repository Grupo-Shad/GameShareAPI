import UsersMongoDb from "./usersMongoDb.js";

class UsersFactory {
  static get(tipo) {
    switch (tipo) {
      case "MONGODB":
        return new UsersMongoDb();
      default:
        return new UsersMongoDb();
    }
  }
}

export default UsersFactory;
