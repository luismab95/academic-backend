import { NextFunction, Response, Request } from "express";
import { responseHelper } from "../../../shared/helpers";
import { ServiceContainer } from "../../../shared/infrastructure/ServicesContainer";

export class AcademicController {
  async getAcademicRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { identification } = req.params;

      const data = await ServiceContainer.academic.getAcademicRecord(
        identification
      );

      responseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }

  async sendAcademicRecordPdfByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { identification, studentId } = req.body;

      const data = await ServiceContainer.academic.sendAcademicRecordPdfByEmail(
        identification,
        Number(studentId)
      );

      responseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }
}
