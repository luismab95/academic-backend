import { Router } from "express";
import { DeviceController } from "../controllers/DeviceController";
import { ValidationMiddleware } from "../middlewares";
import { CreateDeviceValidator } from "../validators/DeviceValidator";

const controller = new DeviceController();
const route = Router();

route.post(
  "/",
  ValidationMiddleware(CreateDeviceValidator),
  controller.createDevice
);

export { route as deviceRoutes };
