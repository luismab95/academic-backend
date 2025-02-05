import { body, checkSchema } from "express-validator";

export const CreateDeviceValidator = [
  body("device.name")
    .isString()
    .withMessage("El nombre debe ser un texto.")
    .isLength({ max: 255 })
    .withMessage("El nombre debe tener un máximo de 255 caracteres.")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("El nombre es requerido."),
  body("device.type")
    .isString()
    .withMessage("El tipo debe ser un texto.")
    .isLength({ max: 50 })
    .withMessage("El tipo debe tener un máximo de 50 caracteres.")
    .optional(),
  body("device.serie")
    .isString()
    .withMessage("La serie debe ser un texto.")
    .isLength({ max: 255 })
    .withMessage("La serie debe tener un máximo de 255 caracteres.")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("La serie es requerida."),
  body("device.operationSystem")
    .isString()
    .withMessage("El sistema operativo debe ser un texto.")
    .isLength({ max: 100 })
    .withMessage("El sistema operativo debe tener un máximo de 100 caracteres.")
    .optional(),
  body("device.version")
    .isString()
    .withMessage("La versión debe ser un texto.")
    .isLength({ max: 50 })
    .withMessage("La versión debe tener un máximo de 50 caracteres.")
    .optional(),
  body("publicKey")
    .isString()
    .withMessage("La clave pública debe ser un texto.")
    .matches(/-----BEGIN PUBLIC KEY-----[\s\S]+-----END PUBLIC KEY-----/)
    .withMessage("La clave pública no es válida.")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("La clave pública es requerida."),
];
