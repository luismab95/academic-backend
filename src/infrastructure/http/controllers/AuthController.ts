import { NextFunction, Request, Response } from "express";
import { ResponseHelper } from "../../../shared/helpers/ResponseHelper";
import { ServiceContainer } from "../../../shared/infrastructure/ServicesContainer";
import { SignIn, SignInMfa, SignUp } from "../../../domain/entities/Auth";

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

      ResponseHelper(
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

      ResponseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }

  async signInMfa(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, type, otp } = req.body as SignInMfa;

      const data = await ServiceContainer.auth.signInMfa(email, otp, type);

      ResponseHelper(req, res, data);
    } catch (error) {
      next(error);
    }
  }

  async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = req.params;

      await ServiceContainer.auth.signOut(sessionId);

      ResponseHelper(req, res, `Sesión ${sessionId} cerrada correctamente`);
    } catch (error) {
      next(error);
    }
  }
}
