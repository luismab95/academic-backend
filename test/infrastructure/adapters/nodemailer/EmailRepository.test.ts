import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { NodemailerEmailRepository } from "../../../../src/infrastructure/adapters/nodemailer/EmailRepository";
import { Email } from "../../../../src/domain/entities";

jest.mock("nodemailer");

describe("NodemailerEmailRepository", () => {
  let emailRepository: NodemailerEmailRepository;
  let mockTransporter: jest.Mocked<
    nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>
  >;

  beforeEach(() => {
    mockTransporter = {
      sendMail: jest.fn(),
    } as unknown as jest.Mocked<
      nodemailer.Transporter<
        SMTPTransport.SentMessageInfo,
        SMTPTransport.Options
      >
    >;
    nodemailer.createTransport = jest.fn().mockReturnValue(mockTransporter);
    emailRepository = new NodemailerEmailRepository();
  });

  it("should send an email", async () => {
    const email = {
      from: "example@me",
      to: "example@me",
      subject: "subject",
      template: "template",
      data: {},
    } as Email;

    mockTransporter.sendMail.mockResolvedValue({} as any);
    (emailRepository as any).getTemplate = jest.fn().mockResolvedValue("html");

    await emailRepository.sendEmail(email);

    expect(emailRepository["getTemplate"]).toHaveBeenCalledTimes(1);
    expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1);
  });
});
