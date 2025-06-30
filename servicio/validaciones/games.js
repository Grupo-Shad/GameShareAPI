import Joi from "joi";

export const validarCrearJuego = (juego) => {
  const juegoSchema = Joi.object({
    name: Joi.string().min(1).max(100).required().messages({
      "string.min": "Nombre del juego es requerido",
      "string.max": "Nombre del juego no puede tener más de 100 caracteres",
      "any.required": "Nombre del juego es requerido",
    }),
    releaseDate: Joi.date().required().messages({
      "date.base": "Fecha de lanzamiento debe ser una fecha válida",
      "any.required": "Fecha de lanzamiento es requerida",
    }),
    publisher: Joi.string().min(1).max(50).required().messages({
      "string.min": "Publisher es requerido",
      "string.max": "Publisher no puede tener más de 50 caracteres",
      "any.required": "Publisher es requerido",
    }),
    availablePlatforms: Joi.array()
      .items(Joi.string())
      .min(1)
      .required()
      .messages({
        "array.min": "Debe especificar al menos una plataforma",
        "any.required": "Plataformas disponibles son requeridas",
      }),
    developerStudio: Joi.string().min(1).max(50).required().messages({
      "string.min": "Developer Studio es requerido",
      "string.max": "Developer Studio no puede tener más de 50 caracteres",
      "any.required": "Developer Studio es requerido",
    }),
    genre: Joi.array().items(Joi.string()).min(1).required().messages({
      "array.min": "Debe especificar al menos un género",
      "any.required": "Géneros son requeridos",
    }),
    featured: Joi.boolean().optional().default(false),
    imageUrl: Joi.string().uri().required().messages({
      "string.uri": "URL de imagen debe ser una URL válida",
      "any.required": "URL de imagen es requerida",
    }),
  });

  const { error } = juegoSchema.validate(juego);
  if (error) {
    return { result: false, error };
  }
  return { result: true };
};

export const validarActualizarJuego = (juego) => {
  const juegoSchema = Joi.object({
    name: Joi.string().min(1).max(100).optional().messages({
      "string.min": "Nombre del juego no puede estar vacío",
      "string.max": "Nombre del juego no puede tener más de 100 caracteres",
    }),
    releaseDate: Joi.date().optional().messages({
      "date.base": "Fecha de lanzamiento debe ser una fecha válida",
    }),
    publisher: Joi.string().min(1).max(50).optional().messages({
      "string.min": "Publisher no puede estar vacío",
      "string.max": "Publisher no puede tener más de 50 caracteres",
    }),
    availablePlatforms: Joi.array()
      .items(Joi.string())
      .min(1)
      .optional()
      .messages({
        "array.min": "Debe especificar al menos una plataforma",
      }),
    developerStudio: Joi.string().min(1).max(50).optional().messages({
      "string.min": "Developer Studio no puede estar vacío",
      "string.max": "Developer Studio no puede tener más de 50 caracteres",
    }),
    genre: Joi.array().items(Joi.string()).min(1).optional().messages({
      "array.min": "Debe especificar al menos un género",
    }),
    featured: Joi.boolean().optional(),
    imageUrl: Joi.string().uri().optional().messages({
      "string.uri": "URL de imagen debe ser una URL válida",
    }),
  });

  const { error } = juegoSchema.validate(juego);
  if (error) {
    return { result: false, error };
  }
  return { result: true };
};

export const validarCrearJuegoMiddleware = (req, res, next) => {
  const validacion = validarCrearJuego(req.body);
  if (!validacion.result) {
    const errorMessage = validacion.error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: errorMessage });
  }
  next();
};

export const validarActualizarJuegoMiddleware = (req, res, next) => {
  const validacion = validarActualizarJuego(req.body);
  if (!validacion.result) {
    const errorMessage = validacion.error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: errorMessage });
  }
  next();
};
