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

    // GET /users - Ruta de prueba
    router.get("/", (req, res) => {
      res.json({ message: "API Users funcionando correctamente" });
    });

    // POST /users - Crear nuevo usuario
    router.post(
      "/",
      validarCrearUsuarioMiddleware,
      this.#controlador.createUser
    );

    return router;
  }
}

export default UsersRouter;
