import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { ValidationMiddleware } from "../middlewares/ExpressValidatorMiddleware";
import {
  SignInMfaValidator,
  SignInValidator,
  SignOutValidator,
  SignUpValidator,
} from "../validators/AuthValidators";

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

route.delete(
  "/sign-out/:sessionId",
  ValidationMiddleware(SignOutValidator),
  controller.signOut
);

export { route as authRoutes };
