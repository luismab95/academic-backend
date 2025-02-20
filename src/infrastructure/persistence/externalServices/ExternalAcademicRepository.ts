import { AcademicRecord } from "../../../domain/entities/Academic";
import { AcademicRepository } from "../../../domain/repositories/AcademicRepository";
import { axiosRequetsForGet, ErrorResponse } from "../../../shared/helpers";
import environment from "../../../shared/infrastructure/Environment";

export class ExternalAcademicRepository implements AcademicRepository {
  async getAcademicRecord(identification: number): Promise<AcademicRecord> {
    try {
      const { data } = await axiosRequetsForGet(
        `${environment.ACADEMIC_SERVICE}${identification}`
      );
      return data.data as AcademicRecord;
    } catch (error) {
      throw new ErrorResponse(
        "Error al obtener datos del servicio académico",
        400
      );
    }
  }
}
