import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import environment from "../../../shared/infrastructure/Environment";
import { Email } from "../../../domain/entities";
import { EmailRepository } from "../../../domain/repositories";
import { ErrorResponse } from "../../../shared/helpers";

const mailerSend = new MailerSend({
  apiKey: environment.MAIL_PASSWORD,
});

export class MailersendEmailRepository implements EmailRepository {
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
    const sentFrom = new Sender(
      `${environment.MAIL_FROM}`,
      `${environment.MAIL_NAME}`
    );
    const recipients = [new Recipient(email.to)];
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(email.subject)
      .setHtml(htmlContent);

    try {
      await mailerSend.email.send(emailParams);
    } catch (error) {
      throw new ErrorResponse(
        `Error al enviar el correo: ${JSON.stringify(error)}`,
        400
      );
    }
  }
}
