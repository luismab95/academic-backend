import { NextFunction, Request, Response } from "express";
import { responseHelper } from "../../../shared/helpers";
import { ServiceContainer } from "../../../shared/infrastructure/ServicesContainer";
import { User } from "../../../domain/entities";

export class UserController {
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const user = await ServiceContainer.user.getUserById(Number(userId));

      responseHelper(req, res, user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const user = req.body as User;

      await ServiceContainer.user.updateUser(Number(userId), user);

      responseHelper(req, res, "Usuario actualizado correctamente");
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { password, otp, method, type } = req.body;
      await ServiceContainer.user.updatePassword(
        Number(userId),
        password,
        otp,
        method,
        type
      );

      responseHelper(req, res, "Contraseña actualizada correctamente");
    } catch (error) {
      next(error);
    }
  }
}
