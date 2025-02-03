import { Router } from "express";
import { ValidationMiddleware } from "../middlewares/ExpressValidatorMiddleware";
import { UserController } from "../controllers/UserController";
import { GetUserByIdValidator } from "../validators/UserValidator";

const controller = new UserController();
const route = Router();

route.get(
  "/:userId",
  ValidationMiddleware(GetUserByIdValidator),
  controller.getUserById
);

export { route as userRoutes };
