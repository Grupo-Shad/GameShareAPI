import express from "express";
import UsersController from "../controlador/users.controller.js";
import { validarCrearUsuarioMiddleware } from "../servicio/validaciones/users.js";

class UsersRouter {
  #controlador;

  constructor(persistencia) {
    this.#controlador = new UsersController(persistencia);
  }

  start() {
    const router = express.Router();

    // GET /users/search?q=query - Buscar usuarios
    router.get("/search", this.#controlador.searchUsers);

    // GET /users/firebase/:firebaseUid - Obtener usuario por Firebase UID
    router.get(
      "/firebase/:firebaseUid",
      this.#controlador.getUserByFirebaseUid
    );

    // POST /users/register-or-get - Registrar o obtener usuario existente
    router.post("/register-or-get", this.#controlador.registerOrGetUser);

    // GET /users - Obtener todos los usuarios o buscar
    router.get("/", this.#controlador.getUsers);

    // GET /users/:id - Obtener usuario por ID
    router.get("/:id", this.#controlador.getUser);

    // POST /users - Crear nuevo usuario
    router.post(
      "/",
      validarCrearUsuarioMiddleware,
      this.#controlador.createUser
    );

    // PUT /users/:id - Actualizar usuario
    router.put("/:id", this.#controlador.updateUser);

    // DELETE /users/:id - Eliminar usuario
    router.delete("/:id", this.#controlador.deleteUser);

    return router;
  }
}

export default UsersRouter;
