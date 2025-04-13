import { errorDatabase } from "../../../shared/utils/DatabaseError.util";
import { ErrorResponse } from "../../../shared/helpers";
import {
  Certificate,
  CertificateCodeRef,
  CertificateData,
  User,
} from "../../../domain/entities";
import { CertificateRepository } from "../../../domain/repositories/CertificateRepository";
import { AppDataSource } from "./DatabaseConnection";
import colors from "colors";

export class PostgresCertificateRepository implements CertificateRepository {
  private readonly certificateRepository =
    AppDataSource.getRepository(Certificate);

  private readonly certificateCodeRefRepository =
    AppDataSource.getRepository(CertificateCodeRef);

  async createCertificate(certificate: Certificate): Promise<Certificate> {
    try {
      return await this.certificateRepository.save(certificate);
    } catch (error) {
      console.error(colors.red.bold(error));

      if (error.code === "23505") {
        errorDatabase(
          error.detail,
          "No se pudo crear la referencia para código de verificación del certificado."
        );
      }

      throw new ErrorResponse(
        "No se pudo crear la referencia para código de verificación del certificado.",
        400
      );
    }
  }

  async findCertificate(certificateId: string): Promise<CertificateData | null> {
    return await this.certificateRepository
      .createQueryBuilder()
      .select([
        "c.id as id",
        "c.code as code",
        "c.hash as hash",
        "c.status as status",
        "c.metadata as metadata",
        'c.createdAt as "createdAt"',
        'c.userId as "userId"',
        'u.name as "name"',
        'u.lastname as "lastname"',
        'u.identification as "identification"',
        'u.email as "email"',
      ])
      .from(Certificate, "c")
      .innerJoin(User, "u", "u.id = c.userId")
      .where("c.code = :certificateId", { certificateId })
      .andWhere("c.status = :status", { status: true })
      .getRawOne<CertificateData>();
  }

  async createCertificateCodeRef(
    certificateCodeRef: CertificateCodeRef
  ): Promise<CertificateCodeRef> {
    try {
      return await this.certificateCodeRefRepository.save(certificateCodeRef);
    } catch (error) {
      console.error(colors.red.bold(error));

      if (error.code === "23505") {
        errorDatabase(
          error.detail,
          "No se pudo crear la referencia para código de verificación del certificado."
        );
      }

      throw new ErrorResponse(
        "No se pudo crear la referencia para código de verificación del certificado.",
        400
      );
    }
  }

  async updateCertificateCodeRef(code: string): Promise<CertificateCodeRef> {
    const result = await this.certificateCodeRefRepository.update(
      { code },
      { status: false }
    );
    return result.raw[0];
  }

  async findCertificateCodeRef(
    code: string
  ): Promise<CertificateCodeRef | null> {
    return await this.certificateCodeRefRepository.findOne({
      where: { code, status: true },
    });
  }
}
