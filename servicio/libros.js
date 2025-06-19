import ModelFactory from "../model/DAO/librosFactory.js";
import { validar } from "./validaciones/libros.js";
class Servicio {
  #model;

  constructor(persistencia) {
    this.#model = ModelFactory.get(persistencia);
  }

  obtenerLibros = async (id) => {
    if (id) {
      const libro = await this.#model.obtenerLibro(id);
      return libro;
    } else {
      console.log("aaa entro al endpoint");
      const libros = await this.#model.obtenerLibros();
      return libros;
    }
  };

  guardarLibro = async (libro) => {
    const res = validar(libro);
    if (res.result) {
      const libroGuardado = await this.#model.guardarLibro(libro);
      return libroGuardado;
    } else {
      throw new Error(res.error.details[0].message);
    }
  };

  actualizarLibro = async (id, libro) => {
    const libroActualizado = await this.#model.actualizarLibro(id, libro);
    return libroActualizado;
  };

  borrarLibro = async (id) => {
    const libroEliminado = await this.#model.borrarLibro(id);
    return libroEliminado;
  };
}
export default Servicio;
