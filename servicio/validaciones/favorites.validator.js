import Joi from "joi";

export const validar = (favorites) => {
  const favoritesSchema = Joi.object({
    userId: Joi.string().required(),
    gameId: Joi.string().required(),
  });
  
  return favoritesSchema.validate(favorites);
};

export const validateFavorites = (req, res, next) => {
  const { error } = validar(req.body);
  
  if (error) {
    return res.status(400).json({
      error: "Datos de validación incorrectos",
      details: error.details.map(detail => detail.message)
    });
  }
  
  next();
};
