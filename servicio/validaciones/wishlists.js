import Joi from "joi";

export const validarCrearWishlist = (wishlist) => {
  const wishlistSchema = Joi.object({
    title: Joi.string().min(1).max(100).required().messages({
      "string.min": "Título de la wishlist es requerido",
      "string.max": "Título no puede tener más de 100 caracteres",
      "any.required": "Título es requerido",
    }),
    description: Joi.string().max(500).allow("").optional().messages({
      "string.max": "Descripción no puede tener más de 500 caracteres",
    }),
  });

  const { error } = wishlistSchema.validate(wishlist);
  if (error) {
    return { result: false, error };
  }
  return { result: true };
};

export const validarAgregarJuego = (datos) => {
  const agregarJuegoSchema = Joi.object({
    gameId: Joi.string().required().messages({
      "any.required": "Game ID es requerido",
    }),
    notes: Joi.string().max(200).allow("").optional().messages({
      "string.max": "Notas no pueden tener más de 200 caracteres",
    }),
  });

  const { error } = agregarJuegoSchema.validate(datos);
  if (error) {
    return { result: false, error };
  }
  return { result: true };
};

export const validarCompartirWishlist = (datos) => {
  const compartirSchema = Joi.object({
    targetUserId: Joi.string().required().messages({
      "any.required": "Target User ID es requerido",
    }),
  });

  const { error } = compartirSchema.validate(datos);
  if (error) {
    return { result: false, error };
  }
  return { result: true };
};

export const validarEliminarJuego = (datos) => {
  return { result: true };
};

// Middlewares para usar en los routers
export const validarCrearWishlistMiddleware = (req, res, next) => {
  const validacion = validarCrearWishlist(req.body);
  if (!validacion.result) {
    const errorMessage = validacion.error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: errorMessage });
  }
  next();
};

export const validarAgregarJuegoMiddleware = (req, res, next) => {
  const validacion = validarAgregarJuego(req.body);
  if (!validacion.result) {
    const errorMessage = validacion.error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: errorMessage });
  }
  next();
};

export const validarCompartirWishlistMiddleware = (req, res, next) => {
  const validacion = validarCompartirWishlist(req.body);
  if (!validacion.result) {
    const errorMessage = validacion.error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: errorMessage });
  }
  next();
};

export const validarEliminarJuegoMiddleware = (req, res, next) => {
  const validacion = validarEliminarJuego(req.body);
  if (!validacion.result) {
    const errorMessage = validacion.error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: errorMessage });
  }
  next();
};
