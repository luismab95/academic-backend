import { body, param } from "express-validator";

export const SignUpValidator = [
  body("name")
    .isString()
    .withMessage("Nombres debe ser un texto")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Nombres es requerido"),
  body("lastname")
    .isString()
    .withMessage("Apellidos debe ser un texto")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Apellidos es requerido"),
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
    .withMessage("Correo Electrónico es requerido"),
  body("password")
    .isString()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Contraseña es requerida")
    .isLength({ min: 8 })
    .withMessage("Contraseña debe tener al menos 8 caracteres"),
];

export const SignInValidator = [
  body("email")
    .isEmail()
    .withMessage("Correo Electrónico no válido")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Correo Electrónico es requerido"),
  body("password")
    .isString()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Contraseña es requerida"),
];

export const SignInMfaValidator = [
  body("email")
    .isEmail()
    .withMessage("Correo Electrónico no válido")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Correo Electrónico es requerido"),
  body("otp")
    .isNumeric()
    .withMessage("Código de verificación debe ser un texto numérico")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Código de verificación es requerido")
    .isLength({ min: 4, max: 4 })
    .withMessage("Código de verificación debe tener 4 caracteres"),
  body("type")
    .isString()
    .withMessage("Tipo no válido")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Tipo es requerida")
    .isIn(["sms", "email"])
    .withMessage("Tipo debe ser 'sms' o 'email'"),
];

export const SignOutValidator = [
  param("sessionId")
    .isString()
    .withMessage("Id de sesión no válido")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Id de sesión es requerido"),
];
