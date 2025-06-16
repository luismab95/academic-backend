import { PostgreDeviceRepository } from "../../../../src/infrastructure/persistence/postgres/DeviceRepository";
import { AppDataSource } from "../../../../src/infrastructure/persistence/postgres/DatabaseConnection";
import { Device } from "../../../../src/domain/entities";
import { generateSHA256Hash } from "../../../../src/shared/helpers";
import { Repository } from "typeorm";

jest.mock(
  "../../../../src/infrastructure/persistence/postgres/DatabaseConnection"
);
jest.mock("../../../../src/shared/helpers");

const mockDevice = { id: 1, serie: "12345" } as Device;
const createRepositoryMock = () => ({
  save: jest.fn().mockResolvedValue(mockDevice),
});
const mockTransaction = async (callback) => {
  const repositoryMock = createRepositoryMock();
  const context = {
    getRepository: () => repositoryMock,
  };
  return await callback(context);
};

describe("PostgreDeviceRepository", () => {
  let deviceRepository: PostgreDeviceRepository;
  let mockRepository: jest.Mocked<Repository<Device>>;

  beforeAll(() => {
    mockRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<Repository<Device>>;
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
    deviceRepository = new PostgreDeviceRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createDevice", () => {
    it("should create a new device and public key", async () => {
      const mockPublicKey = "publicKey";
      const mockHash = "hashedPublicKey";

      (generateSHA256Hash as jest.Mock).mockReturnValue(mockHash);

      (AppDataSource.transaction as jest.Mock).mockImplementation(
        mockTransaction
      );

      const result = await deviceRepository.createDevice(
        mockDevice,
        mockPublicKey
      );

      expect(result).toEqual(mockDevice);
      expect(AppDataSource.transaction).toHaveBeenCalledTimes(1);
      expect(generateSHA256Hash).toHaveBeenCalledWith(mockPublicKey);
    });
  });

  describe("findDeviceBySerie", () => {
    it("should find a device by serie", async () => {
      const mockDevice = { id: 1, serie: "12345" } as Device;
      mockRepository.findOne.mockResolvedValue(mockDevice);

      const result = await deviceRepository.findDeviceBySerie("12345");

      expect(result).toEqual(mockDevice);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { serie: "12345" },
      });
    });

    it("should return null if no device is found", async () => {
      mockRepository.findOne.mockResolvedValue(null);
      const result = await deviceRepository.findDeviceBySerie("12345");

      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { serie: "12345" },
      });
    });
  });
});
