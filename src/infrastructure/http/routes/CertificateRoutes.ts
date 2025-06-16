import { Router } from "express";
import { VerifyTokenMiddleware, ValidationMiddleware } from "../middlewares";
import {
  DownloadValidator,
  ValidateCertificateValidator,
} from "../validators/CertificateValidator";
import { CertificateController } from "../controllers/CertificateController";

const controller = new CertificateController();
const route = Router();

route.post(
  "/download",
  [VerifyTokenMiddleware, ValidationMiddleware(DownloadValidator)],
  controller.getCertificate
);

route.post(
  "/validate",
  [ValidationMiddleware(ValidateCertificateValidator)],
  controller.validateCertificate
);

export { route as certificateRoutes };
