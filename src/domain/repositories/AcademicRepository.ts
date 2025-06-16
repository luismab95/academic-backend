import { AcademicRecord } from "../entities/Academic";

export interface AcademicRepository {
  getAcademicRecord(
    studentId: number,
    universityId: number
  ): Promise<AcademicRecord>;
  getAcademicRecords(): Promise<AcademicRecord[]>;
}
