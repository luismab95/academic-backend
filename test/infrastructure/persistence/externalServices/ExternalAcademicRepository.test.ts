import { AcademicRecord } from "../../../../src/domain/entities/";
import {
  axiosRequetsForGet,
  ErrorResponse,
} from "../../../../src/shared/helpers";
import { ExternalAcademicRepository } from "../../../../src/infrastructure/persistence/externalServices/ExternalAcademicRepository";
import environment from "../../../../src/shared/infrastructure/Environment";

jest.mock("../../../../src/shared/helpers/AxiosHelper", () => ({
  axiosRequetsForGet: jest.fn(),
}));

describe("ExternalAcademicRepository", () => {
  let externalAcademicRepository: ExternalAcademicRepository;

  beforeEach(() => {
    externalAcademicRepository = new ExternalAcademicRepository();
  });

  describe("getAcademicRecord", () => {
    it("should return the academic records", async () => {
      const academicRecord = {
        student: {
          id_estudiante: 1,
          identificacion: "123456789",
          nombre: "John Doe",
          apellido: "Vares Daer",
        },
        university: {
          id_universidad: 1,
        },
      } as AcademicRecord;

      (axiosRequetsForGet as jest.Mock).mockResolvedValue({
        data: { data: [academicRecord] },
      });

      const result = await externalAcademicRepository.getAcademicRecords();

      expect(axiosRequetsForGet).toHaveBeenCalledWith(
        `${environment.ACADEMIC_SERVICE}`
      );
      expect(result).toEqual([academicRecord]);
    });

    it("should return thrown error if the academic records called failed", async () => {
      (axiosRequetsForGet as jest.Mock).mockRejectedValue(
        new ErrorResponse("Error al obtener datos del servicio académico", 400)
      );

      await expect(
        externalAcademicRepository.getAcademicRecords()
      ).rejects.toThrow(ErrorResponse);

      expect(axiosRequetsForGet).toHaveBeenCalledWith(
        `${environment.ACADEMIC_SERVICE}`
      );
    });
  });

  describe("getAcademicRecord", () => {
    it("should return the academic record by identification", async () => {
      const academicRecord = {
        student: {
          id_estudiante: 1,
          identificacion: "123456789",
          nombre: "John Doe",
          apellido: "Vares Daer",
        },
        university: {
          id_universidad: 1,
        },
      } as AcademicRecord;

      (axiosRequetsForGet as jest.Mock).mockResolvedValue({
        data: { data: academicRecord },
      });

      const result = await externalAcademicRepository.getAcademicRecord(
        academicRecord.student.id_estudiante,
        academicRecord.university.id_universidad
      );

      expect(axiosRequetsForGet).toHaveBeenCalledWith(
        `${environment.ACADEMIC_SERVICE}detail?studentId=${academicRecord.student.id_estudiante}&universityId=${academicRecord.university.id_universidad}`
      );
      expect(result).toEqual(academicRecord);
    });

    it("should return thrown error if the academic record called failed", async () => {
      (axiosRequetsForGet as jest.Mock).mockRejectedValue(
        new ErrorResponse("Error al obtener datos del servicio académico", 400)
      );

      await expect(
        externalAcademicRepository.getAcademicRecord(1, 1)
      ).rejects.toThrow(ErrorResponse);

      expect(axiosRequetsForGet).toHaveBeenCalledWith(
        `${environment.ACADEMIC_SERVICE}detail?studentId=1&universityId=1`
      );
    });
  });
});
