import { NextFunction, Response, Request } from "express";
import { responseHelper } from "../../../shared/helpers";
import { ServiceContainer } from "../../../shared/infrastructure/ServicesContainer";

export class AcademicController {
  async getAcademic(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ServiceContainer.academic.getAcademic();
      responseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }

  async getAcademicRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { universityId, studentId, identification } = req.query;
      const data = await ServiceContainer.academic.getAcademicRecord(
        String(identification),
        Number(universityId),
        Number(studentId)
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
      const { identification, studentId, universityId } = req.body;

      const data = await ServiceContainer.academic.sendAcademicRecordPdfByEmail(
        identification,
        Number(universityId),
        Number(studentId)
      );

      responseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }
}
