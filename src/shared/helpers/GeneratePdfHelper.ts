import pdfParse from "pdf-parse";
import pdfMakePrinter from "pdfmake/src/printer";
import { ErrorResponse } from "./ResponseHelper";

const fonts = {
  Roboto: {
    normal: "fonts/Roboto-Regular.ttf",
    bold: "fonts/Roboto-Medium.ttf",
    italics: "fonts/Roboto-Italic.ttf",
    bolditalics: "fonts/Roboto-MediumItalic.ttf",
  },
};

const printer = new pdfMakePrinter(fonts);

export function generatePdfBase64(docDefinition: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    const chunks: Buffer[] = [];

    pdfDoc.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    pdfDoc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      const pdfBase64 = pdfBuffer.toString("base64");
      resolve(pdfBase64);
    });

    pdfDoc.on("error", (err: any) => {
      reject(new ErrorResponse(`Error al generar el PDF: ${err}`, 400));
    });

    pdfDoc.end();
  });
}

export async function extractPdfMetadata(base64String: string): Promise<any> {
  try {
    const cleanBase64 = base64String.split(";base64,").pop() || base64String;
    const pdfBuffer = Buffer.from(cleanBase64, "base64");
    const data = await pdfParse(pdfBuffer);

    return {
      metadata: data.metadata || {},
      info: data.info || {},
    };
  } catch (error) {
    throw new ErrorResponse(
      "No se pudo completar el proceso de verificación del certificado, es posible que el documento proporcionado no sea válido.",
      400
    );
  }
}
