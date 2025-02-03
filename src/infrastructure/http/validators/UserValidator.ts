import { param } from "express-validator";

export const GetUserByIdValidator = [
  param("userId")
    .isNumeric()
    .withMessage("Id de usuario no válido")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Id de usuario es requerido"),
];
