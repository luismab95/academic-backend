import { ErrorResponse } from "../../../shared/helpers";
import { PublicKey } from "../../../domain/entities";
import { PublicKeyRepository } from "../../../domain/repositories/PublicKeyRepository";
import { AppDataSource } from "./DatabaseConnection";
import { errorDatabase } from "../../../shared/utils/DatabaseError.util";
import colors from "colors";

export class PostgresPublicKeyRepository implements PublicKeyRepository {
  private readonly publicKeyRepository = AppDataSource.getRepository(PublicKey);

  async createPublicKey(publicKey: PublicKey): Promise<PublicKey> {
    try {
      return await this.publicKeyRepository.save(publicKey);
    } catch (error) {
      console.error(colors.red.bold(error));

      if (error.code === "23505") {
        errorDatabase(error.detail, "No se pudo crear la clave pública.");
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
