import { AcademicRecord } from "../../../domain/entities/Academic";
import { AcademicRepository } from "../../../domain/repositories/AcademicRepository";
import { axiosRequetsForGet, ErrorResponse } from "../../../shared/helpers";
import environment from "../../../shared/infrastructure/Environment";

export class ExternalAcademicRepository implements AcademicRepository {
  async getAcademicRecord(
    studentId: number,
    universityId: number
  ): Promise<AcademicRecord> {
    try {
      const { data } = await axiosRequetsForGet(
        `${environment.ACADEMIC_SERVICE}detail?studentId=${studentId}&universityId=${universityId}`
      );
      return data.data as AcademicRecord;
    } catch (error) {
      throw new ErrorResponse(
        "Error al obtener datos del servicio académico",
        400
      );
    }
  }

  async getAcademicRecords(): Promise<AcademicRecord[]> {
    try {
      const { data } = await axiosRequetsForGet(
        `${environment.ACADEMIC_SERVICE}`
      );
      return data.data as AcademicRecord[];
    } catch (error) {
      throw new ErrorResponse(
        "Error al obtener datos del servicio académico",
        400
      );
    }
  }
}
