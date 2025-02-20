import { body, query } from "express-validator";

export const GetAcademicRecordByIdentificationValidator = [
  query("identification")
    .isString()
    .withMessage("Cédula debe ser un texto numérico")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Cédula es requerido")
    .isLength({ min: 10, max: 10 })
    .withMessage("Cédula debe tener 10 caracteres"),
  query("studentId")
    .isInt()
    .withMessage("Estudiante debe ser un texto numérico")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Estudiante es requerido"),
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
