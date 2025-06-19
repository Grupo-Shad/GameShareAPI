import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8080;
const MODO_PERSISTENCIA = process.env.MODO_PERSISTENCIA || "";

export default { PORT, MODO_PERSISTENCIA };
