import { NextFunction, Request, Response } from "express";
import { maskEmail, responseHelper } from "../../../shared/helpers";
import { ServiceContainer } from "../../../shared/infrastructure/ServicesContainer";
import { SignIn, SignInMfa, SignUp } from "../../../domain/entities";

export class AuthController {
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, lastname, identification, email, password } =
        req.body as SignUp;
      const user = await ServiceContainer.user.createUser(
        name,
        lastname,
        email,
        password,
        identification
      );

      responseHelper(
        req,
        res,
        `Se registro el usuario ${maskEmail(user.email)} correctamente`
      );
    } catch (error) {
      next(error);
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as SignIn;
      const data = await ServiceContainer.auth.signIn(email, password);
      responseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }

  async signInMfa(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, method, otp, device } = req.body as SignInMfa;
      const clientIp = req.headers["x-client-ip"] as string;

      const data = await ServiceContainer.auth.signInMfa(
        email,
        otp,
        method,
        device,
        clientIp
      );

      responseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }

  async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;
      await ServiceContainer.auth.signOut(sessionId);

      responseHelper(req, res, `Sesión cerrada correctamente`);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { contact, method, type } = req.body;

      const data = await ServiceContainer.auth.forgotPassword(
        contact,
        method,
        type
      );

      responseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }

  async validForgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { contact, method, otp, type } = req.body;

      const userId = await ServiceContainer.auth.validForgotPassword(
        contact,
        otp,
        method,
        type
      );

      responseHelper(req, res, {
        userId,
        message: "Codigo de verificación correcto",
      });
    } catch (error) {
      next(error);
    }
  }

  async getPublicKey(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ServiceContainer.auth.getPublicKey();
      responseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }
}
