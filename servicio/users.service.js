import UsersFactory from "../model/DAO/usersFactory.js";

class UsersService {
  #model;

  constructor(persistencia) {
    this.#model = UsersFactory.get(persistencia);
  }

  createUser = async (username, email, firebaseUid, avatar = "") => {
    if (!username || !email || !firebaseUid) {
      throw new Error("Username, email y firebaseUid son requeridos");
    }

    const existingUser = await this.#model.getUserByUsername(
      username.toLowerCase()
    );
    if (existingUser) {
      throw new Error("El username ya está en uso");
    }

    const userData = {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      firebaseUid,
      avatar: avatar || "",
    };

    const savedUser = await this.#model.saveUser(userData);

    return {
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      avatar: savedUser.avatar,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };
  };

  updateUser = async (id, updateData) => {
    const existingUser = await this.#model.getUser(id);
    if (!existingUser) {
      throw new Error("Usuario no encontrado");
    }

    const allowedFields = ["username", "email", "avatar"];
    const filteredData = {};

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    if (filteredData.username) {
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(filteredData.username)) {
        throw new Error(
          "Username debe tener 3-20 caracteres y solo contener letras, números y guiones bajos"
        );
      }

      const usernameAvailable = await this.#model.checkUsernameAvailable(
        filteredData.username,
        id
      );
      if (!usernameAvailable) {
        throw new Error("El username ya está en uso");
      }
      filteredData.username = filteredData.username.toLowerCase();
    }

    if (filteredData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(filteredData.email)) {
        throw new Error("Formato de email inválido");
      }

      const emailAvailable = await this.#model.checkEmailAvailable(
        filteredData.email,
        id
      );
      if (!emailAvailable) {
        throw new Error("El email ya está registrado");
      }
      filteredData.email = filteredData.email.toLowerCase();
    }

    const updatedUser = await this.#model.updateUser(id, filteredData);

    return {
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  };

  deleteUser = async (id) => {
    const user = await this.#model.getUser(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const deletedUser = await this.#model.deleteUser(id);

    return {
      id: deletedUser._id,
      username: deletedUser.username,
      email: deletedUser.email,
      avatar: deletedUser.avatar,
      createdAt: deletedUser.createdAt,
      updatedAt: deletedUser.updatedAt,
    };
  };

  checkUsernameAvailable = async (username) => {
    const available = await this.#model.checkUsernameAvailable(username);
    return { available, username };
  };

  searchUsers = async (query) => {
    if (!query || query.trim().length < 2) {
      throw new Error("La búsqueda debe tener al menos 2 caracteres");
    }

    const users = await this.#model.searchUsers(query.trim());

    return users.map((user) => ({
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    }));
  };

  getUsers = async () => {
    const users = await this.#model.getUsers();
    return users.map((user) => ({
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  };

  getUser = async (id) => {
    const user = await this.#model.getUser(id);
    if (!user) {
      return null;
    }
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      firebaseUid: user.firebaseUid,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };

  getUserByFirebaseUid = async (firebaseUid) => {
    const user = await this.#model.getUserByFirebaseUid(firebaseUid);
    if (!user) {
      return null;
    }
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      firebaseUid: user.firebaseUid,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };

  registerOrGetUser = async (username, email, firebaseUid, avatar = "") => {
    if (!firebaseUid) {
      throw new Error("firebaseUid es requerido");
    }

    // Intentar obtener usuario existente
    let user = await this.getUserByFirebaseUid(firebaseUid);

    if (user) {
      return { user, isNew: false };
    }

    // Si no existe, crear nuevo usuario
    if (!username || !email) {
      throw new Error(
        "Username y email son requeridos para crear nuevo usuario"
      );
    }

    user = await this.createUser(username, email, firebaseUid, avatar);
    return { user, isNew: true };
  };
}

export default UsersService;
