import { generateSHA256Hash } from "../../../shared/helpers";
import { Device, PublicKey } from "../../../domain/entities";
import { DeviceRepository } from "../../../domain/repositories";
import { AppDataSource } from "./DatabaseConnection";

export class PostgreDeviceRepository implements DeviceRepository {
  private readonly deviceRepository = AppDataSource.getRepository(Device);

  async createDevice(device: Device, publicKey: string): Promise<Device> {
    return await AppDataSource.transaction(async (cnx) => {
      const newDevice = await cnx.getRepository(Device).save(device);

      const newPublicKey = {
        deviceId: newDevice.id,
        publicKey: publicKey,
        hash: generateSHA256Hash(publicKey),
      } as PublicKey;
      await cnx.getRepository(PublicKey).save(newPublicKey);
      return newDevice;
    });
  }

  async findDeviceBySerie(serie: string): Promise<Device | null> {
    return await this.deviceRepository.findOne({ where: { serie: serie } });
  }
}
