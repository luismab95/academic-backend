import { DeviceService } from "../../../src/application/services/DeviceService";
import {
  DeviceRepository,
  PublicKeyRepository,
} from "../../../src/domain/repositories";
import { Device, PublicKey } from "../../../src/domain/entities";
import { generateSHA256Hash } from "../../../src/shared/helpers";

jest.mock("../../../src/domain/repositories/DeviceRepository");
jest.mock("../../../src/domain/repositories/PublicKeyRepository");
jest.mock("../../../src/shared/helpers", () => ({
  generateSHA256Hash: jest.fn(),
}));

const device: Device = {
  id: 5,
  name: "Luisma",
  type: "mobile phone",
  operationSystem: "Iphone 12 Pro Max",
  version: "18.2.1",
  serie: "F2LDNVSU0D4C",
} as Device;
const publicKey = "publicKey";

describe("DeviceService", () => {
  let deviceRepository: jest.Mocked<DeviceRepository>;
  let publicKeyRepository: jest.Mocked<PublicKeyRepository>;
  let generateSHA256HashMock: jest.Mock;
  let deviceService: DeviceService;

  deviceRepository = {
    findDeviceBySerie: jest.fn(),
    createDevice: jest.fn(),
  } as unknown as jest.Mocked<DeviceRepository>;
  publicKeyRepository = {
    updatePublicKeyByDevice: jest.fn(),
    createPublicKey: jest.fn(),
  } as unknown as jest.Mocked<PublicKeyRepository>;
  generateSHA256HashMock = generateSHA256Hash as jest.Mock;
  deviceService = new DeviceService(deviceRepository, publicKeyRepository);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new device", async () => {
    deviceRepository.findDeviceBySerie.mockResolvedValue(undefined);

    await deviceService.createDevice(device, publicKey);

    expect(deviceRepository.createDevice).toHaveBeenCalledWith(
      device,
      publicKey
    );
  });

  it("should update the public key when the device already exists", async () => {
    deviceRepository.findDeviceBySerie.mockResolvedValue(device);
    generateSHA256HashMock.mockReturnValue("hashedPublicKey");

    const newPublicKey = {
      deviceId: device.id,
      publicKey,
      hash: generateSHA256Hash(publicKey),
    } as PublicKey;

    await deviceService.createDevice(device, publicKey);

    expect(publicKeyRepository.updatePublicKeyByDevice).toHaveBeenCalledWith({
      deviceId: device.id,
      isActive: false,
    });
    expect(newPublicKey.hash).toBe("hashedPublicKey");
    expect(publicKeyRepository.createPublicKey).toHaveBeenCalledWith(
      newPublicKey
    );
  });
});
