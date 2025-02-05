import { Repository } from "typeorm";
import { PublicKey } from "../../../../src/domain/entities/";
import { PostgresPublicKeyRepository } from "../../../../src/infrastructure/persistence/postgres/PublicKeyRepository";
import { AppDataSource } from "../../../../src/infrastructure/persistence/postgres/DatabaseConnection";

jest.mock(
  "../../../../src/infrastructure/persistence/postgres/DatabaseConnection"
);

describe("PostgresPublicKeyRepository", () => {
  let publicKeyRepository: PostgresPublicKeyRepository;
  let mockRepository: jest.Mocked<Repository<PublicKey>>;

  beforeEach(() => {
    mockRepository = {
      update: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<PublicKey>>;

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
    publicKeyRepository = new PostgresPublicKeyRepository();
  });

  describe("updatePublicKeyByDevice", () => {
    it("should update the public key by device ID and return the raw result", async () => {
      const publicKey = new PublicKey();
      publicKey.deviceId = 1;
      publicKey.publicKey = "newPublicKey";

      const rawResult = [{ id: 1, publicKey: "newPublicKey" }];
      mockRepository.update.mockResolvedValue({ raw: rawResult } as any);

      const result = await publicKeyRepository.updatePublicKeyByDevice(
        publicKey
      );

      expect(mockRepository.update).toHaveBeenCalledWith(
        { deviceId: publicKey.deviceId },
        publicKey
      );
      expect(result).toEqual(rawResult);
    });

    it("should return an empty array if no rows were updated", async () => {
      const publicKey = new PublicKey();
      publicKey.deviceId = 1;
      publicKey.publicKey = "newPublicKey";

      mockRepository.update.mockResolvedValue({ raw: [] } as any);

      const result = await publicKeyRepository.updatePublicKeyByDevice(
        publicKey
      );

      expect(mockRepository.update).toHaveBeenCalledWith(
        { deviceId: publicKey.deviceId },
        publicKey
      );
      expect(result).toEqual([]);
    });
  });

  describe("createPublicKey", () => {
    it("should create a new public key and return it", async () => {
      const publicKey = new PublicKey();
      publicKey.deviceId = 1;
      publicKey.publicKey = "newPublicKey";

      mockRepository.save.mockResolvedValue(publicKey);

      const result = await publicKeyRepository.createPublicKey(publicKey);

      expect(mockRepository.save).toHaveBeenCalledWith(publicKey);
      expect(result).toEqual(publicKey);
    });

    it("should throw an error if the public key already exists", async () => {
      const publicKey = new PublicKey();
      publicKey.deviceId = 1;
      publicKey.publicKey = "existingPublicKey";

      const error = new Error() as any;
      error.code = "23505";
      error.detail = "publicKey already exists";

      mockRepository.save.mockRejectedValue(error);

      await expect(
        publicKeyRepository.createPublicKey(publicKey)
      ).rejects.toThrow("Clave pública ya existe.");

      expect(mockRepository.save).toHaveBeenCalledWith(publicKey);
    });

    it("should throw a generic error if creation fails", async () => {
      const publicKey = new PublicKey();
      publicKey.deviceId = 1;
      publicKey.publicKey = "newPublicKey";

      const error = new Error("Some error");

      mockRepository.save.mockRejectedValue(error);

      await expect(
        publicKeyRepository.createPublicKey(publicKey)
      ).rejects.toThrow("No se pudo crear la clave pública.");

      expect(mockRepository.save).toHaveBeenCalledWith(publicKey);
    });
  });
  
  describe("findByDeviceId", () => {
    it("should return the public key for the given device ID", async () => {
      const publicKey = new PublicKey();
      publicKey.deviceId = 1;
      publicKey.publicKey = "existingPublicKey";
      publicKey.isActive = true;

      mockRepository.findOne.mockResolvedValue(publicKey);

      const result = await publicKeyRepository.findByDeviceId(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { deviceId: 1, isActive: true },
      });
      expect(result).toEqual(publicKey);
    });

    it("should return null if no public key is found for the given device ID", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await publicKeyRepository.findByDeviceId(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { deviceId: 1, isActive: true },
      });
      expect(result).toBeNull();
    });
  });
});
