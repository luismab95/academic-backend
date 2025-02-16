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
import { DecryptDataMiddleware } from "../middlewares/CryptoMiddleware";

const controller = new AuthController();
const route = Router();

route.post(
  "/sign-up",
  [DecryptDataMiddleware, ValidationMiddleware(SignUpValidator)],
  controller.signUp
);

route.post(
  "/sign-in",
  [DecryptDataMiddleware, ValidationMiddleware(SignInValidator)],
  controller.signIn
);

route.post(
  "/sign-in/mfa",
  [DecryptDataMiddleware, ValidationMiddleware(SignInMfaValidator)],
  controller.signInMfa
);

route.post(
  "/forgot-password",
  [DecryptDataMiddleware, ValidationMiddleware(ForgotPasswordValidator)],
  controller.forgotPassword
);

route.post(
  "/valid-forgot-password",
  [DecryptDataMiddleware, ValidationMiddleware(ValidForgotPasswordValidator)],
  controller.validForgotPassword
);

route.get("/public-key", controller.getPublicKey);

route.delete(
  "/sign-out/:sessionId",
  [
    DecryptDataMiddleware,
    VerifyTokenMiddleware,
    ValidationMiddleware(SignOutValidator),
  ],
  controller.signOut
);

export { route as authRoutes };
