import {
  dateFormat,
  ErrorResponse,
  extractPdfMetadata,
  generateSHA256Hash,
  maskEmail,
  maskString,
  validateTokenCertificate,
} from "../../shared/helpers";
import { CertificateRepository } from "../../domain/repositories";

export class CertificateService {
  constructor(private readonly certificateRepository: CertificateRepository) {}

  async getCertificate(code: string) {
    const certificateCodeRef =
      await this.certificateRepository.findCertificateCodeRef(code);
    if (!certificateCodeRef) {
      throw new ErrorResponse("No se encontro data.", 400);
    }

    const payload = validateTokenCertificate(certificateCodeRef.token);

    const certificate = await this.certificateRepository.findCertificate(
      payload.certificateId
    );
    if (!certificate) {
      throw new ErrorResponse("No se encontro data.", 400);
    }

    return certificate.metadata;
  }

  async validateCertificate(pdf: string) {
    const metadata = await extractPdfMetadata(pdf);

    const certificate = await this.certificateRepository.findCertificate(
      metadata.info.Subject
    );
    if (!certificate)
      throw new ErrorResponse(
        "Certificado no encontrado en nuestros registros",
        400
      );

    const hashToValidate = generateSHA256Hash(pdf);
    if (hashToValidate !== certificate.hash)
      throw new ErrorResponse(
        "El certificado ha sido alterado y no coincide con nuestro registro original",
        400
      );

    certificate.identification = maskString(certificate.identification);
    certificate.email = maskEmail(certificate.email);
    certificate.createdAt = dateFormat(certificate.createdAt as Date);

    return {
      code: certificate.code,
      fullname: `${certificate.name} ${certificate.lastname}`,
      email: certificate.email,
      identification: certificate.identification,
      createdAt: certificate.createdAt,
    };
  }
}
