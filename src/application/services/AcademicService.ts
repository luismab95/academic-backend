import {
  dateFormat,
  ErrorResponse,
  generatePdfBase64,
  generateRandomNumber,
  maskEmail,
} from "../../shared/helpers";
import {
  AcademicRepository,
  EmailRepository,
  UserRepository,
} from "../../domain/repositories/";
import { AcademicRecord, Email, User } from "../../domain/entities";
import environment from "../../shared/infrastructure/Environment";

export class AcademicService {
  constructor(
    private readonly academicRepository: AcademicRepository,
    private readonly userRepository: UserRepository,
    private readonly emailRepository: EmailRepository
  ) {}

  async getAcademicRecord(identification: string) {
    const randomStudent = generateRandomNumber();
    const { user, record } = await this.getUserAndAcademicRecord(
      identification,
      randomStudent
    );

    const docDefinition = this.getDocDefinition(record, user, true);
    const pdfBase64 = await generatePdfBase64(docDefinition);

    return { randomStudent, pdfBase64 };
  }

  async sendAcademicRecordPdfByEmail(
    identification: string,
    randomStudent: number
  ) {
    const { user, record } = await this.getUserAndAcademicRecord(
      identification,
      randomStudent
    );

    const docDefinition = this.getDocDefinition(record, user, false);

    const pdfBase64 = await generatePdfBase64(docDefinition);

    await this.emailRepository.sendEmail({
      data: {
        year: new Date().getFullYear(),
        fullname: `${user.name} ${user.lastname}`,
        subject: "Certificado de Calificaciones",
      },
      from: environment.MAIL_FROM,
      subject: "Certificado de Calificaciones",
      to: user.email,
      template: "academic",
      attachments: [
        {
          filename: `${user.name} ${user.lastname}-${dateFormat(
            new Date(),
            "YYYY-MM-DD-HH:mm:ss"
          )}-record.pdf`,
          content: Buffer.from(pdfBase64, "base64"),
          contentType: "application/pdf",
        },
      ],
    } as Email);

    return `Se ha enviado el certificado de calificaciones al correo ${maskEmail(
      user.email
    )}`;
  }

  private getDocDefinition(
    record: AcademicRecord,
    user: User,
    watermaker: boolean
  ) {
    let semesters = [];
    record.semesters.forEach((semester) => {
      const semestersCourse = [
        {
          text: `PERÍODO DE MATRÍCULA: ${semester.semester.toUpperCase()}`,
          fontSize: 10,
          bold: true,
          alignment: "left",
          margin: [0, 10, 0, 10],
        },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto", "auto"],
            body: [
              [
                {
                  text: "CÓDIGO",
                  bold: true,
                  fontSize: 10,
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: "MATERIA",
                  bold: true,
                  fontSize: 10,
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: "CALIFICACIÓN",
                  bold: true,
                  fontSize: 10,
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: "ESTADO",
                  bold: true,
                  fontSize: 10,
                  style: "tableHeader",
                  alignment: "center",
                },
              ],
              ...semester.courses.map((course) => [
                {
                  text: course.code,
                  fontSize: 8,
                  alignment: "center",
                },
                {
                  text: course.name,
                  fontSize: 8,
                  alignment: "left",
                },
                {
                  text: course.grade,
                  fontSize: 8,
                  alignment: "center",
                },
                {
                  text: course.state,
                  fontSize: 8,
                  alignment: "center",
                },
              ]),
            ],
          },
        },
        {
          text: `Promedio: ${semester.average}`,
          fontSize: 8,
          bold: true,
          alignment: "left",
          margin: [0, 4, 0, 4],
        },
        {
          text: "",
          fontSize: 8,
          bold: true,
          alignment: "center",
          margin: [0, 4, 0, 4],
        },
      ];
      semesters = semesters.concat(semestersCourse);
    });

    const docDefinition = {
      pageMargins: [40, 86, 40, 40],
      watermark: watermaker
        ? {
            text: "BORRADOR",
            color: "black",
            opacity: 0.3,
            bold: true,
            italics: false,
          }
        : null,
      header: {
        stack: [
          {
            text: record.university.nombre.toUpperCase(),
            fontSize: 16,
            bold: true,
            alignment: "center",
            margin: [0, 10, 0, 1],
          },
          {
            text: record.faculty.nombre.toUpperCase(),
            fontSize: 14,
            bold: true,
            alignment: "center",
            margin: [0, 1, 0, 1],
          },
          {
            text: record.school.nombre.toUpperCase(),
            fontSize: 12,
            bold: true,
            alignment: "center",
            margin: [0, 1, 0, 10],
          },
        ],
      },
      footer: function (currentPage: number, pageCount: number) {
        return {
          text: `Página ${currentPage} de ${pageCount}`,
          alignment: "right",
          fontSize: 6,
          margin: [0, 0, 40, 10],
        };
      },
      content: [
        {
          text: "RÉCORD ACADÉMICO",
          fontSize: 10,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            {
              text: `MATRÍCULA: ${record.student.matricula.toUpperCase()}`,
              fontSize: 8,
              bold: false,
              alignment: "left",
              margin: [0, 0, 0, 4],
            },
            {
              text: `CÉDULA DE IDENTIDAD: ${user.identification.toUpperCase()}`,
              fontSize: 8,
              bold: false,
              alignment: "left",
              margin: [0, 0, 0, 4],
            },
          ],
        },
        {
          columns: [
            {
              text: `APELLIDOS: ${user.lastname.toUpperCase()}`,
              fontSize: 8,
              bold: false,
              alignment: "left",
              margin: [0, 0, 0, 4],
            },
            {
              text: `NOMBRES: ${user.name.toUpperCase()}`,
              fontSize: 8,
              bold: false,
              alignment: "left",
              margin: [0, 0, 0, 4],
            },
          ],
        },
        {
          text: "",
          fontSize: 8,
          bold: false,
          alignment: "center",
          margin: [0, 10, 0, 10],
        },
        ...semesters,
        {
          text: `OBSERVACIONES`,
          fontSize: 8,
          bold: true,
          alignment: "left",
          margin: [0, 60, 0, 0],
        },
        {
          text: " ",
          fontSize: 8,
          bold: true,
          alignment: "left",
          margin: [0, 60, 0, 60],
        },
        {
          table: {
            headerRows: 1,
            widths: ["*"],
            body: [
              [
                {
                  text: "Nota mínima y máxima para aprobar: 7 - 10",
                  alignment: "left",
                  fontSize: 6,
                  margin: [0, 10, 0, 10],
                },
              ],
            ],
          },
        },
        {
          text: `PROMEDIO GENERAL: ${record.average}`,
          fontSize: 8,
          bold: true,
          alignment: "left",
          margin: [0, 10, 0, 10],
        },
        {
          text: `${dateFormat(new Date(), "ll")}.`,
          fontSize: 8,
          bold: false,
          alignment: "right",
          margin: [0, 10, 4, 10],
        },
        {
          text: "",
          fontSize: 8,
          bold: true,
          alignment: "left",
          margin: [0, 40, 0, 40],
        },
        !watermaker
          ? {
              columns: [
                { qr: "text in QR", fit: 50, alignment: "center" },
                { qr: "text in QR", fit: 50, alignment: "center" },
              ],
            }
          : null,
        {
          columns: [
            {
              text: "_______________________________________",
              fontSize: 8,
              bold: false,
              alignment: "center",
            },
            {
              text: "_______________________________________",
              fontSize: 8,
              bold: false,
              alignment: "center",
            },
          ],
        },
        {
          columns: [
            {
              text: `${record.autorities[0].nombre.toUpperCase()} ${record.autorities[0].apellido.toUpperCase()}`,
              fontSize: 8,
              bold: false,
              alignment: "center",
              margin: [0, 0, 0, 0],
            },
            {
              text: `${record.autorities[1].nombre.toUpperCase()} ${record.autorities[1].apellido.toUpperCase()}`,
              fontSize: 8,
              bold: false,
              alignment: "center",
              margin: [0, 0, 0, 0],
            },
          ],
        },
        {
          columns: [
            {
              text: `${record.autorities[0].cargo.toUpperCase()}`,
              fontSize: 8,
              bold: true,
              alignment: "center",
              margin: [0, 0, 0, 0],
            },
            {
              text: `${record.autorities[1].cargo.toUpperCase()}`,
              fontSize: 8,
              bold: true,
              alignment: "center",
              margin: [0, 0, 0, 0],
            },
          ],
        },
      ],
    };

    return docDefinition;
  }

  private async getUserAndAcademicRecord(
    identification: string,
    randomStudent: number
  ) {
    const user = await this.userRepository.findUserByIdentification(
      identification
    );
    if (!user) throw new ErrorResponse("Usuario no encontrado", 404);

    const record = await this.academicRepository.getAcademicRecord(
      randomStudent
    );

    return { user, record };
  }
}
