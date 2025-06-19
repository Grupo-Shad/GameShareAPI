import Joi from "joi";

export const validar = (libro) => {
  const librosSchema = Joi.object({
    titulo: Joi.string().required(),
    autor: Joi.string().required(),
    año: Joi.number().integer().min(1).max(3000).required(),
  });

  const { error } = librosSchema.validate(libro);
  if (error) {
    return { result: false, error };
  }
  return { result: true };
};
