import Joi from "joi";

export const validarCrearUsuario = (usuario) => {
  const usuarioSchema = Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
      "string.min": "Username debe tener al menos 3 caracteres",
      "string.max": "Username no puede tener más de 50 caracteres",
      "any.required": "Username es requerido",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Email debe tener un formato válido",
      "any.required": "Email es requerido",
    }),
    firebaseUid: Joi.string().required().messages({
      "any.required": "Firebase UID es requerido",
    }),
    avatar: Joi.string().uri().allow("").optional().messages({
      "string.uri": "Avatar debe ser una URL válida",
    }),
  });

  const { error } = usuarioSchema.validate(usuario);
  if (error) {
    return { result: false, error };
  }
  return { result: true };
};

export const validarCrearUsuarioMiddleware = (req, res, next) => {
  const validacion = validarCrearUsuario(req.body);
  if (!validacion.result) {
    const errorMessage = validacion.error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: errorMessage });
  }
  next();
};
