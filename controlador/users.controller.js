import UsersService from "../servicio/users.service.js";

class UsersController {
  #service;

  constructor(persistencia) {
    this.#service = new UsersService(persistencia);
  }

  getUsers = async (req, res) => {
    try {
      const { search } = req.query;

      if (search) {
        const users = await this.#service.searchUsers(search);
        return res.json(users);
      }

      const users = await this.#service.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await this.#service.getUser(id);

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getUserByFirebaseUid = async (req, res) => {
    try {
      const { firebaseUid } = req.params;
      const user = await this.#service.getUserByFirebaseUid(firebaseUid);

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  createUser = async (req, res) => {
    try {
      const { username, email, firebaseUid, avatar } = req.body;
      const user = await this.#service.createUser(
        username,
        email,
        firebaseUid,
        avatar
      );
      res.status(201).json(user);
    } catch (error) {
      if (error.message.includes("ya está en uso")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  };

  updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const { firebaseUid, createdAt, updatedAt, _id, ...allowedData } =
        updateData;

      const updatedUser = await this.#service.updateUser(id, allowedData);
      res.json(updatedUser);
    } catch (error) {
      if (error.message === "Usuario no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      if (
        error.message.includes("ya está en uso") ||
        error.message.includes("ya está registrado") ||
        error.message.includes("formato") ||
        error.message.includes("caracteres")
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  };

  deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await this.#service.deleteUser(id);

      res.json({
        message: "Usuario eliminado exitosamente",
        user: deletedUser,
      });
    } catch (error) {
      if (error.message === "Usuario no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  };

  checkUsernameAvailable = async (req, res) => {
    try {
      const { username } = req.params;

      if (!username) {
        return res.status(400).json({ error: "Username es requerido" });
      }

      const result = await this.#service.checkUsernameAvailable(username);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  registerOrGetUser = async (req, res) => {
    try {
      const { username, email, firebaseUid, avatar } = req.body;

      if (!firebaseUid) {
        return res.status(400).json({ error: "firebaseUid es requerido" });
      }

      let user = await this.#service.getUserByFirebaseUid(firebaseUid);

      if (user) {
        return res.json({ user, isNew: false });
      }

      if (!username || !email) {
        return res.status(400).json({
          error: "Username y email son requeridos para crear nuevo usuario",
        });
      }

      user = await this.#service.createUser(
        username,
        email,
        firebaseUid,
        avatar
      );
      res.status(201).json({ user, isNew: true });
    } catch (error) {
      if (
        error.message.includes("ya está en uso") ||
        error.message.includes("ya está registrado") ||
        error.message.includes("formato") ||
        error.message.includes("caracteres")
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  };

  searchUsers = async (req, res) => {
    try {
      const { q } = req.query;

      if (!q) {
        return res
          .status(400)
          .json({ error: "Parámetro de búsqueda 'q' es requerido" });
      }

      const users = await this.#service.searchUsers(q);
      res.json(users);
    } catch (error) {
      if (error.message.includes("al menos 2 caracteres")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  };
}

export default UsersController;
