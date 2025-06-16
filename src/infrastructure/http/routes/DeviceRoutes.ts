import { Router } from "express";
import { DeviceController } from "../controllers/DeviceController";
import { ValidationMiddleware } from "../middlewares";
import {
  CreateDeviceValidator,
  GetDeviceBySerieValidator,
} from "../validators/DeviceValidator";

const controller = new DeviceController();
const route = Router();

route.get(
  "/:serie",
  ValidationMiddleware(GetDeviceBySerieValidator),
  controller.getDeviceBySerie
);
route.post(
  "/",
  ValidationMiddleware(CreateDeviceValidator),
  controller.createDevice
);

export { route as deviceRoutes };
