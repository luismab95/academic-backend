import pdfMakePrinter from "pdfmake/src/printer";

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
      reject(err);
    });

    pdfDoc.end();
  });
}
