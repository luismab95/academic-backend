import { body } from "express-validator";

export const DownloadValidator = [
  body("code")
    .isString()
    .withMessage("Código de verificación debe ser un texto")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Código de verificación es requerido")
    .isLength({ min: 16, max: 16 })
    .withMessage("Código de verificación debe tener 16 caracteres"),
];

export const ValidateCertificateValidator = [
  body("pdf")
    .isString()
    .withMessage("PDF debe ser un texto")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("PDF es requerido"),
];
