import { generateSHA256Hash } from "../../shared/helpers";
import { Device, PublicKey } from "../../domain/entities";
import {
  DeviceRepository,
  PublicKeyRepository,
} from "../../domain/repositories";

export class DeviceService {
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly publicKeyRepository: PublicKeyRepository
  ) {}

  async createDevice(device: Device, publicKey: string) {
    const findDevice = await this.deviceRepository.findDeviceBySerie(
      device.serie
    );
    if (findDevice) {
      const updatePublicKey = {} as PublicKey;
      updatePublicKey.deviceId = findDevice.id;
      updatePublicKey.isActive = false;
      await this.publicKeyRepository.updatePublicKeyByDevice(updatePublicKey);

      const newPublicKey = {
        deviceId: findDevice.id,
        publicKey,
        hash: generateSHA256Hash(publicKey),
      } as PublicKey;
      await this.publicKeyRepository.createPublicKey(newPublicKey);
    } else {
      await this.deviceRepository.createDevice(device, publicKey);
    }
  }

  async getDeviceBySerie(serie: string) {
    const device = await this.deviceRepository.findDeviceBySerie(serie);

    if (!device) {
      return "Dispositivo no encontrado";
    }

    return device;
  }
}
