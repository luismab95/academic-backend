import { Router } from "express";
import {
  VerifyTokenMiddleware,
  DecryptDataMiddleware,
  ValidationMiddleware,
} from "../middlewares";
import { AcademicController } from "../controllers/AcademicController";
import {
  GetAcademicRecordByIdentificationValidator,
  SendAcademicRecordPdfValidator,
} from "../validators/AcademicValidator";

const controller = new AcademicController();
const route = Router();

route.get(
  "/record",
  [DecryptDataMiddleware, VerifyTokenMiddleware],
  controller.getAcademic
);

route.get(
  "/record/pdf",
  [
    DecryptDataMiddleware,
    VerifyTokenMiddleware,
    ValidationMiddleware(GetAcademicRecordByIdentificationValidator),
  ],
  controller.getAcademicRecord
);

route.post(
  "/record",
  [
    DecryptDataMiddleware,
    VerifyTokenMiddleware,
    ValidationMiddleware(SendAcademicRecordPdfValidator),
  ],
  controller.sendAcademicRecordPdfByEmail
);

export { route as academicRoutes };
