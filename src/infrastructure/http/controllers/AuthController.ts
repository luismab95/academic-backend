import { NextFunction, Request, Response } from "express";
import { responseHelper } from "../../../shared/helpers";
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
        `Se registro el usuario ${user.email} correctamente`
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
      const { email, type, otp, device } = req.body as SignInMfa;
      const clientIp = req.headers["x-client-ip"] as string;

      const data = await ServiceContainer.auth.signInMfa(
        email,
        otp,
        type,
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
      const { email, method } = req.body;

      const data = await ServiceContainer.auth.forgotPassword(email, method);

      responseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }

  async validForgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, method, otp } = req.body;

      await ServiceContainer.auth.validForgotPassword(email, otp, method);

      responseHelper(req, res, "Codigo de verificación correcto");
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
