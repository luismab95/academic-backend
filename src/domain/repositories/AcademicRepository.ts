import { AcademicRecord } from "../entities/Academic";

export interface AcademicRepository {
  getAcademicRecord(identification: number): Promise<AcademicRecord>;
}
