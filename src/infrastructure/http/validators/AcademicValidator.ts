import { body, param } from "express-validator";

export const GetAcademicRecordByIdentificationValidator = [
  param("identification")
    .isString()
    .withMessage("Cédula debe ser un texto numérico")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Cédula es requerido")
    .isLength({ min: 10, max: 10 })
    .withMessage("Cédula debe tener 10 caracteres"),
];

export const SendAcademicRecordPdfValidator = [
  body("identification")
    .isString()
    .withMessage("Cédula debe ser un texto numérico")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Cédula es requerido")
    .isLength({ min: 10, max: 10 })
    .withMessage("Cédula debe tener 10 caracteres"),
  body("studentId")
    .isInt()
    .withMessage("Estudiante debe ser un texto numérico")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Estudiante es requerido"),
];
