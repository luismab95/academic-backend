import { body, param } from "express-validator";

export const CommonUserValidator = [
  body("name")
    .isString()
    .withMessage("Nombres debe ser un texto")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Nombres es requerido")
    .isLength({ max: 100 })
    .withMessage("Nombres debe tener un máximo de 100 caracteres"),
  body("lastname")
    .isString()
    .withMessage("Apellidos debe ser un texto")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Apellidos es requerido")
    .isLength({ max: 100 })
    .withMessage("Apellidos debe tener un máximo de 100 caracteres"),
  body("identification")
    .isString()
    .withMessage("Cédula debe ser un texto numérico")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Cédula es requerido")
    .isLength({ min: 10, max: 10 })
    .withMessage("Cédula debe tener 10 caracteres"),
  body("email")
    .isEmail()
    .withMessage("Correo Electrónico no válido")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Correo Electrónico es requerido")
    .isLength({ max: 100 })
    .withMessage("Correo Electrónico debe tener un máximo de 100 caracteres"),
];

export const UpdateUserValidator = [
  param("userId")
    .isNumeric()
    .withMessage("Id de usuario no válido")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Id de usuario es requerido"),
  body("phone")
    .isString()
    .withMessage("Teléfono debe ser un texto numérico")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Teléfono es requerido")
    .isLength({ max: 20 })
    .withMessage("Teléfono debe tener un máximo de 20 caracteres"),
  ...CommonUserValidator,
];

export const GetUserByIdValidator = [
  param("userId")
    .isNumeric()
    .withMessage("Id de usuario no válido")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Id de usuario es requerido"),
];

export const CommonAuthVerifyValidator = [
  body("method")
    .isString()
    .withMessage("Método no válido")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Método es requerida")
    .isIn(["sms", "email"])
    .withMessage("Método debe ser 'sms' o 'email'"),
  body("otp")
    .isString()
    .withMessage("Código de verificación debe ser un texto")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Código de verificación es requerido")
    .isLength({ min: 6, max: 6 })
    .withMessage("Código de verificación debe tener 6 caracteres"),
  body("type")
    .isString()
    .withMessage("Tipo no válido")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Tipo es requerido")
    .isIn(["login", "reset-password", "forgot-password"])
    .withMessage(
      "Tipo debe ser 'login' o 'reset-password' o 'forgot-password'"
    ),
];

export const UpdateUserPasswordValidator = [
  param("userId")
    .isNumeric()
    .withMessage("Id de usuario no válido")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Id de usuario es requerido"),
  body("password")
    .isString()
    .withMessage("Contraseña debe ser un texto")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Contraseña es requerida")
    .isLength({ min: 8 })
    .withMessage("Contraseña debe tener al menos 8 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial"
    ),
  ...CommonAuthVerifyValidator,
];
