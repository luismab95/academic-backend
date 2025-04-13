import { NextFunction, Response, Request } from "express";
import { responseHelper } from "../../../shared/helpers";
import { ServiceContainer } from "../../../shared/infrastructure/ServicesContainer";

export class CertificateController {
  async getCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.body;
      const data = await ServiceContainer.certificate.getCertificate(code);
      responseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }

  async validateCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const { pdf } = req.body;
      const data = await ServiceContainer.certificate.validateCertificate(pdf);

      responseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }
}
