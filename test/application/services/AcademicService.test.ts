import {
  AcademicRepository,
  EmailRepository,
  UserRepository,
} from "../../../src/domain/repositories";
import { AcademicService } from "../../../src/application/services/AcademicService";
import { AcademicRecord, User } from "../../../src/domain/entities";

jest.mock("../../../src/shared/helpers", () => ({
  generatePdfBase64: jest.fn().mockResolvedValue("pdfBase64"),
  generateRandomNumber: jest.fn().mockReturnValue(1),
  dateFormat: jest.fn(),
  maskEmail: jest.fn().mockReturnValue("john.doe@****.com"),
}));

const mockRecord = {
  university: {
    id_universidad: 1,
    nombre: "Universidad Tecnológica del Futuro",
    direccion: "Avenida del Conocimiento 123, Ciudad Innovación",
    telefono: "+1 555-1234-567",
    correo: "contacto@utf.edu",
    anio_fundacion: 1985,
    logo_url: "https://www.ejemplo.com/logo_utf.png",
  },
  faculty: {
    id_facultad: 7,
    nombre: "Facultad de Ciencias de la Computación",
    descripcion: "Desarrollo de software, inteligencia artificial y más.",
    logo_url: "https://www.ejemplo.com/logos/computacion.png",
    id_universidad: 1,
  },
  school: {
    id_escuela: 19,
    id_facultad: 7,
    nombre: "Escuela de Desarrollo de Software",
    descripcion: "Programación, bases de datos y arquitectura de software.",
    logo_url: "https://www.ejemplo.com/logos/desarrollo_software.png",
    semestres: 10,
  },
  student: {
    id_estudiante: 1,
    nombre: "Gonzalo",
    apellido: "Rincón",
    matricula: "20240133",
    correo: "gonzalo.rincon@utf.edu",
    fecha_nacimiento: "2002-06-14T05:00:00.000Z",
    direccion: "Carrera 12 #34-56",
    identificacion: "ID20240133",
  },
  semesters: [
    {
      semester: "15/1/2012 - 13/6/2012",
      courses: [
        {
          code: 721,
          name: "Programación 1",
          grade: "8.18",
          state: "APROBADO",
        },
      ],
      average: "8.35",
    },
  ],
  average: "8.42",
  autorities: [
    {
      id_relacion: 37,
      id_autoridad: 37,
      id_universidad: 1,
      id_facultad: null,
      id_escuela: 19,
      cargo: "Director",
      nombre: "Antonio",
      apellido: "García",
      correo: "a.garcia@utf.edu",
      telefono: "+1 555-1190",
      foto_url: "https://www.ejemplo.com/fotos/antonio_garcia.png",
    },
    {
      id_relacion: 38,
      id_autoridad: 38,
      id_universidad: 1,
      id_facultad: null,
      id_escuela: 19,
      cargo: "Secretario Académico",
      nombre: "Carolina",
      apellido: "Alvarez",
      correo: "c.alvarez@utf.edu",
      telefono: "+1 555-1191",
      foto_url: "https://www.ejemplo.com/fotos/carolina_alvarez.png",
    },
  ],
} as AcademicRecord;

const user = {
  identification: "1234567890",
  name: "John",
  lastname: "Doe",
} as User;

describe("AcademicService", () => {
  let userRepository: jest.Mocked<UserRepository>;
  let emailRepository: jest.Mocked<EmailRepository>;
  let academicRepository: jest.Mocked<AcademicRepository>;

  let academicService: AcademicService;

  academicRepository = {
    getAcademicRecord: jest.fn(),
  } as unknown as jest.Mocked<AcademicRepository>;
  userRepository = {
    findUserByIdentification: jest.fn(),
  } as unknown as jest.Mocked<UserRepository>;
  emailRepository = {
    sendEmail: jest.fn(),
  } as unknown as jest.Mocked<EmailRepository>;
  academicService = new AcademicService(
    academicRepository,
    userRepository,
    emailRepository
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get academic record", async () => {
    userRepository.findUserByIdentification.mockResolvedValue(user);
    academicRepository.getAcademicRecord.mockResolvedValue(mockRecord);

    const result = await academicService.getAcademicRecord(user.identification);

    expect(result).toEqual({
      randomStudent: mockRecord.student.id_estudiante,
      pdfBase64: "pdfBase64",
    });

    expect(userRepository.findUserByIdentification).toHaveBeenCalledWith(
      user.identification
    );
    expect(academicRepository.getAcademicRecord).toHaveBeenCalledWith(
      mockRecord.student.id_estudiante
    );
  });

  it("should send academic record pdf by email", async () => {
    userRepository.findUserByIdentification.mockResolvedValue(user);
    academicRepository.getAcademicRecord.mockResolvedValue(mockRecord);

    const result = await academicService.sendAcademicRecordPdfByEmail(
      user.identification,
      mockRecord.student.id_estudiante
    );

    expect(result).toBe(
      "Se ha enviado el certificado de calificaciones al correo john.doe@****.com"
    );

    expect(academicRepository.getAcademicRecord).toHaveBeenCalledWith(
      mockRecord.student.id_estudiante
    );
    expect(userRepository.findUserByIdentification).toHaveBeenCalledWith(
      user.identification
    );
  });
});
