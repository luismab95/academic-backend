import { NextFunction, Request, Response } from "express";
import { responseHelper } from "../../../shared/helpers";
import { ServiceContainer } from "../../../shared/infrastructure/ServicesContainer";

export class DeviceController {
  async createDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const { device, publicKey } = req.body;

      await ServiceContainer.device.createDevice(device, publicKey);

      responseHelper(req, res, "Dispositivo creado correctamente");
    } catch (error) {
      next(error);
    }
  }

  async getDeviceBySerie(req: Request, res: Response, next: NextFunction) {
    try {
      const { serie } = req.params;

      const device = await ServiceContainer.device.getDeviceBySerie(serie);

      responseHelper(req, res, device);
    } catch (error) {
      next(error);
    }
  }
}
