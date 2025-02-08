import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { ValidationMiddleware } from "../middlewares/ExpressValidatorMiddleware";
import {
  ForgotPasswordValidator,
  SignInMfaValidator,
  SignInValidator,
  SignOutValidator,
  SignUpValidator,
  ValidForgotPasswordValidator,
} from "../validators/AuthValidators";
import { VerifyTokenMiddleware } from "../middlewares";

const controller = new AuthController();
const route = Router();

route.post(
  "/sign-up",
  ValidationMiddleware(SignUpValidator),
  controller.signUp
);

route.post(
  "/sign-in",
  ValidationMiddleware(SignInValidator),
  controller.signIn
);

route.post(
  "/sign-in/mfa",
  ValidationMiddleware(SignInMfaValidator),
  controller.signInMfa
);

route.post(
  "/forgot-password",
  ValidationMiddleware(ForgotPasswordValidator),
  controller.forgotPassword
);

route.post(
  "/valid-forgot-password",
  ValidationMiddleware(ValidForgotPasswordValidator),
  controller.validForgotPassword
);

route.get("/public-key", controller.getPublicKey);

route.delete(
  "/sign-out/:sessionId",
  [VerifyTokenMiddleware, ValidationMiddleware(SignOutValidator)],
  controller.signOut
);

export { route as authRoutes };
