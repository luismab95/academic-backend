import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import environment from "../../../shared/infrastructure/Environment";
import { Email } from "../../../domain/entities";
import { EmailRepository } from "../../../domain/repositories";
import { ErrorResponse } from "../../../shared/helpers";

export class NodemailerEmailRepository implements EmailRepository {
  private readonly transporter: nodemailer.Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      secure: environment.NODE_ENV === 'production',
      requireTLS: environment.NODE_ENV === 'production',
      port: 465,
      auth: {
        user: environment.MAIL_USER,
        pass: environment.MAIL_PASSWORD,
      },
    });
  }

  private async getTemplate(templateName: string, data: any): Promise<string> {
    const templatePath = path.join(
      process.cwd(),
      "/templates",
      `${templateName}.hbs`
    );
    const source = fs.readFileSync(templatePath, "utf-8");

    const template = handlebars.compile(source);
    return template(data);
  }

  async sendEmail(email: Email): Promise<void> {
    const htmlContent = await this.getTemplate(email.template, email.data);

    const mailOptions = {
      from: email.from,
      to: email.to,
      subject: email.subject,
      html: htmlContent,
      attachments: email.attachments || [],
    };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new ErrorResponse(`Error al enviar el correo: ${error}`, 400);
    }
  }
}
