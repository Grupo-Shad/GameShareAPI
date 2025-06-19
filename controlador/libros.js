import Servicio from "../servicio/libros.js";

class Controlador {
  #servicio;

  constructor(persistencia) {
    this.#servicio = new Servicio(persistencia);
  }

  obtenerLibros = async (req, res) => {
    console.log("entro al endpoint");
    const { id } = req.params;
    const libros = await this.#servicio.obtenerLibros(id);
    res.json(libros);
  };

  guardarLibro = async (req, res) => {
    try {
      const libro = req.body;
      if (!Object.keys(libro).length) throw new Error("El libro está vacío");

      const libroGuardado = await this.#servicio.guardarLibro(libro);
      res.json(libroGuardado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  actualizarLibro = async (req, res) => {
    const { id } = req.params;
    const libro = req.body;
    const libroActualizado = await this.#servicio.actualizarLibro(id, libro);
    res
      .status(libroActualizado ? 200 : 404)
      .json(libroActualizado ? libroActualizado : {});
  };

  borrarLibro = async (req, res) => {
    const { id } = req.params;
    const libroEliminado = await this.#servicio.borrarLibro(id);
    res
      .status(libroEliminado ? 200 : 404)
      .json(libroEliminado ? libroEliminado : {});
  };
}

export default Controlador;
