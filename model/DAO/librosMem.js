class ModelMem {
  #libros;

  constructor() {
    this.#libros = [
      {
        id: 1,
        titulo: "Cien años de soledad",
        autor: "Gabriel García Márquez",
        año: 1967,
      },
      {
        id: 2,
        titulo: "1984",
        autor: "George Orwell",
        año: 1949,
      },
      {
        id: 3,
        titulo: "El Principito",
        autor: "Antoine de Saint-Exupéry",
        año: 1943,
      },
      {
        id: 4,
        titulo: "Fahrenheit 451",
        autor: "Ray Bradbury",
        año: 1953,
      },
      {
        id: 5,
        titulo: "Don Quijote de la Mancha",
        autor: "Miguel de Cervantes",
        año: 1605,
      },
      {
        id: 6,
        titulo: "Crónica de una muerte anunciada",
        autor: "Gabriel García Márquez",
        año: 1981,
      },
      {
        id: 7,
        titulo: "Orgullo y prejuicio",
        autor: "Jane Austen",
        año: 1813,
      },
      {
        id: 8,
        titulo: "La metamorfosis",
        autor: "Franz Kafka",
        año: 1915,
      },
      {
        id: 9,
        titulo: "Matar a un ruiseñor",
        autor: "Harper Lee",
        año: 1960,
      },
      {
        id: 10,
        titulo: "El nombre de la rosa",
        autor: "Umberto Eco",
        año: 1980,
      },
    ];
  }
  obtenerLibros = async () => this.#libros;

  obtenerLibro = async (id) => {
    const libro = this.#libros.find((l) => l.id == id);
    return libro || {};
  };

  guardarLibro = async (libro) => {
    libro.id = String(
      parseInt(this.#libros[this.#libros.length - 1]?.id || 0) + 1
    );
    this.#libros.push(libro);
    return libro;
  };
  actualizarLibro = async (id, libro) => {
    const index = this.#libros.findIndex((p) => p.id === id);
    if (index != -1) {
      const libroAnt = this.#libros[index];
      const libroAct = { ...libroAnt, ...libro };
      this.#libros.splice(index, 1, libroAct);
      return libroAct;
    } else {
      return null;
    }
  };
  borrarLibro = async (id) => {
    const index = this.#libros.findIndex((p) => p.id === id);
    if (index != -1) {
      const libro = this.#libros.splice(index, 1)[0];
      return libro;
    } else {
      return null;
    }
  };
}
export default ModelMem;
