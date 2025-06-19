import ModelMem from "./librosMem.js";

class ModelFactory {
  static get(tipo) {
    switch (tipo) {
      case "MEM":
        return new ModelMem();
      default:
        return new ModelMem();
    }
  }
}
export default ModelFactory;
