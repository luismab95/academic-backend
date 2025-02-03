import { NextFunction, Request, Response } from "express";
import { ResponseHelper } from "../../../shared/helpers/ResponseHelper";
import { ServiceContainer } from "../../../shared/infrastructure/ServicesContainer";

export class UserController {
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const user = await ServiceContainer.user.getUserById(userId);
      ResponseHelper(req, res, user);
    } catch (error) {
      next(error);
    }
  }
}
