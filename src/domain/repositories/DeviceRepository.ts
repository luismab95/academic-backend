import { EntityManager } from "typeorm";
import { Device } from "../entities";

export interface DeviceRepository {
  createDevice(device: Device, publicKey: string): Promise<Device>;
  findDeviceBySerie(serie: string): Promise<Device | null>;
}
