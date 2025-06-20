import { body, header, param } from "express-validator";
import {
  CommonAuthVerifyValidator,
  CommonUserValidator,
} from "./UserValidator";

export const SignUpValidator = [
  ...CommonUserValidator,
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
    .withMessage("Contraseña debe ser un texto")
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
    .isLength({ min: 6, max: 6 })
    .withMessage("Código de verificación debe tener 6 caracteres"),
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

export const CommonContactValidator = [
  body("contact")
    .trim()
    .notEmpty()
    .withMessage("El contacto no puede estar vacío")
    .custom((value) => {
      const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
      const phoneRegex = /^\+?\d{7,15}$/;

      if (!emailRegex.test(value) && !phoneRegex.test(value)) {
        throw new Error(
          "Debe ser un email válido o un número de teléfono válido"
        );
      }
      return true;
    }),
];

export const ForgotPasswordValidator = [
  ...CommonContactValidator,
  body("method")
    .isString()
    .withMessage("Método no válido")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Método es requerido")
    .isIn(["sms", "email"])
    .withMessage("Método debe ser 'sms' o 'email'"),
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

export const ValidForgotPasswordValidator = [
  ...CommonContactValidator,
  ...CommonAuthVerifyValidator,
];
