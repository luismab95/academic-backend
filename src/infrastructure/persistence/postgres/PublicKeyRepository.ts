import colors from "colors";
import { ErrorResponse } from "../../../shared/helpers";
import { PublicKey } from "../../../domain/entities";
import { PublicKeyRepository } from "../../../domain/repositories/PublicKeyRepository";
import { AppDataSource } from "./DatabaseConnection";

export class PostgresPublicKeyRepository implements PublicKeyRepository {
  private publicKeyRepository = AppDataSource.getRepository(PublicKey);

  async createPublicKey(publicKey: PublicKey): Promise<PublicKey> {
    try {
      return await this.publicKeyRepository.save(publicKey);
    } catch (error) {
      console.error(colors.red.bold(error));

      if (error.code === "23505") {
        switch (true) {
          case error.detail.includes("hash"):
            throw new ErrorResponse("Hash ya existe", 409);
          case error.detail.includes("publicKey"):
            throw new ErrorResponse("Clave pública ya existe.", 409);
        }
      }

      throw new ErrorResponse("No se pudo crear la clave pública.", 400);
    }
  }

  async updatePublicKeyByDevice(publicKey: PublicKey): Promise<PublicKey[]> {
    const result = await this.publicKeyRepository.update(
      { deviceId: publicKey.deviceId },
      publicKey
    );

    return result.raw;
  }

  async findByDeviceId(deviceId: number): Promise<PublicKey | null> {
    return await this.publicKeyRepository.findOne({
      where: { deviceId, isActive: true },
    });
  }
}
