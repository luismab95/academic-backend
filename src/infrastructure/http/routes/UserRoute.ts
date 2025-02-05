import { Router } from "express";
import { UserController } from "../controllers/UserController";
import {
  GetUserByIdValidator,
  UpdateUserPasswordValidator,
  UpdateUserValidator,
} from "../validators/UserValidator";
import { VerifyTokenMiddleware, ValidationMiddleware } from "../middlewares";

const controller = new UserController();
const route = Router();

route.get(
  "/:userId",
  [VerifyTokenMiddleware, ValidationMiddleware(GetUserByIdValidator)],
  controller.getUserById
);
route.put(
  "/:userId",
  [VerifyTokenMiddleware, ValidationMiddleware(UpdateUserValidator)],
  controller.updateUser
);
route.patch(
  "/pwd/:userId",
  [ValidationMiddleware(UpdateUserPasswordValidator)],
  controller.updatePassword
);

export { route as userRoutes };
