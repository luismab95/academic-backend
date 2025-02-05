import { body, header, param } from "express-validator";

export const SignUpValidator = [
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
    .isString()
    .withMessage("Código de verificación debe ser un texto")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Código de verificación es requerido")
    .isLength({ min: 4, max: 4 })
    .withMessage("Código de verificación debe tener 4 caracteres"),
  body("method")
    .isString()
    .withMessage("Método no válido")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Método es requerida")
    .isIn(["sms", "email"])
    .withMessage("Método debe ser 'sms' o 'email'"),
  body("device")
    .isString()
    .withMessage("Dispositivo no válido")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Dispositivo es requerida"),
  header("x-client-ip")
    .isIP()
    .withMessage("IP del cliente debe ser una dirección IP válida")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Ip del cliente es requerido"),
];

export const SignOutValidator = [
  param("sessionId")
    .isString()
    .withMessage("Id de sesión no válido")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Id de sesión es requerido"),
];

export const ForgotPasswordValidator = [
  body("email")
    .isEmail()
    .withMessage("Correo Electrónico no válido")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Correo Electrónico es requerido"),
  body("method")
    .isString()
    .withMessage("Método no válido")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Método es requerida")
    .isIn(["sms", "email"])
    .withMessage("Método debe ser 'sms' o 'email'"),
];

export const ValidForgotPasswordValidator = [
  body("email")
    .isEmail()
    .withMessage("Correo Electrónico no válido")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Correo Electrónico es requerido"),
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
    .isLength({ min: 4, max: 4 })
    .withMessage("Código de verificación debe tener 4 caracteres"),
];
