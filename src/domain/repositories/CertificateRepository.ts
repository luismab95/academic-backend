import { Certificate, CertificateCodeRef, CertificateData } from "../entities";

export interface CertificateRepository {
  createCertificate(certificate: Certificate): Promise<Certificate>;
  findCertificate(certificateId: string): Promise<CertificateData | null>;
  createCertificateCodeRef(
    certificate: CertificateCodeRef
  ): Promise<CertificateCodeRef>;
  updateCertificateCodeRef(code: string): Promise<CertificateCodeRef>;
  findCertificateCodeRef(code: string): Promise<CertificateCodeRef | null>;
}
