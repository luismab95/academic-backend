import fs from "fs";
import path from "path";
import twilio from "twilio";
import { ErrorResponse } from "../../shared/helpers/ResponseHelper";
import environment from "../../shared/infrastructure/Environment";
import {
  comparePassword,
  dateFormat,
  generateRandomString,
  generateSHA256Hash,
  generateToken,
  maskEmail,
  maskString,
} from "../../shared/helpers/";
import {
  AuthRepository,
  DeviceRepository,
  EmailRepository,
  UserRepository,
} from "../../domain/repositories";
import {
  AuthAttempt,
  BloquedUser,
  Email,
  Mfa,
  OtpType,
  otpTypeAction,
  Session,
} from "../../domain/entities";
import moment from "moment-timezone";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailRepository: EmailRepository,
    private readonly deviceRepository: DeviceRepository,
    private readonly userRepository: UserRepository
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.authRepository.signIn(email);
    if (!user) {
      throw new ErrorResponse("Usuario no encontrado", 400);
    }

    const userBloqued = await this.authRepository.findBloquedUser(user.id);
    if (userBloqued) {
      if (userBloqued.expiratedAt > new Date()) {
        throw new ErrorResponse(
          `Su cuenta se encuentra bloqueda por multiples intentos fallidos de autenticación, por favor intentelo despues de: ${dateFormat(
            userBloqued.expiratedAt as Date
          )}`,
          400
        );
      } else {
        const updateBloquedUser = {
          id: userBloqued.id,
          isActive: false,
        } as BloquedUser;
        await this.authRepository.updateBloquedUser(updateBloquedUser);
      }
    }

    const verifyPassword = await comparePassword(password, user.password);

    if (!verifyPassword) {
      const findActiveAttempt = await this.authRepository.findAuthAttempt(
        user.id
      );
      if (findActiveAttempt) {
        if (findActiveAttempt.attempt >= 3) {
          const newUserBloqued = {
            userId: user.id,
            expiratedAt: moment().add(1, "hour").toDate(),
          } as BloquedUser;
          await this.authRepository.createBloquedUser(newUserBloqued);
          await this.authRepository.updateAllActiveAuthAttempt(user.id);
          throw new ErrorResponse(
            `Su cuenta se encuentra bloqueda por multiples intentos fallidos de autenticación, por favor intentelo despues de: ${dateFormat(
              newUserBloqued.expiratedAt as Date
            )}`,
            400
          );
        } else {
          await this.authRepository.updateAuthAttempt({
            id: findActiveAttempt.id,
            userId: user.id,
            attempt: findActiveAttempt.attempt + 1,
          } as AuthAttempt);
        }
      } else {
        const newAttempt = {
          userId: user.id,
          attempt: 1,
        } as AuthAttempt;
        await this.authRepository.createAuthAttempt(newAttempt);
      }

      throw new ErrorResponse("Contraseña incorrecta", 400);
    }

    await this.authRepository.updateAllActiveAuthAttempt(user.id);

    const newMfa = {
      userId: user.id,
      type: "login",
      otp: generateRandomString(6),
      expiratedAt: new Date(Date.now() + 5 * 60000),
    } as Mfa;
    await this.authRepository.createMfa(newMfa);

    await this.emailRepository.sendEmail({
      data: {
        otp: newMfa.otp,
        year: new Date().getFullYear(),
        fullname: `${user.name} ${user.lastname}`,
        subject: "Código de Verificación para Inicio de Sesión",
      },
      from: environment.MAIL_FROM,
      subject: "Código de Verificación para Inicio de Sesión",
      to: user.email,
      template: "sign-in",
    } as Email);

    const maskEmailResponse = maskEmail(user.email);

    return `Se ha enviado un código de verificación al correo ${maskEmailResponse}`;
  }

  async signInMfa(
    email: string,
    otp: string,
    method: OtpType,
    device: string,
    clientIp: string
  ) {
    const { user, findMfa } = await this.validUserAndMfa(
      email,
      otp,
      method,
      "login"
    );

    const deviceInfo = await this.deviceRepository.findDeviceBySerie(device);
    if (!deviceInfo) {
      throw new ErrorResponse(
        "No se encontro información del dispositivo",
        400
      );
    }

    const newSession = {
      userId: user.id,
      accessToken: generateRandomString(8),
      refreshToken: generateRandomString(8),
      deviceId: deviceInfo.id,
      originIp: clientIp,
      expiratedAt: new Date(Date.now() + 30 * 24 * 60 * 60000),
    } as Session;
    const createSession = await this.authRepository.createSession(newSession);

    createSession.accessToken = generateToken(
      {
        sessionId: createSession.id,
        userId: user.id,
        email: user.email,
        fullname: `${user.name} ${user.lastname}`,
      },
      "1d"
    );
    createSession.refreshToken = generateToken(
      {
        sessionId: createSession.id,
        userId: user.id,
        email: user.email,
        fullname: `${user.name} ${user.lastname}`,
      },
      "30d"
    );
    await this.authRepository.updateSession(createSession);

    const updateMfa = { id: findMfa.id, isUsed: true, active: false } as Mfa;
    await this.authRepository.updateMfa(updateMfa);

    return {
      sessionId: createSession.id,
      accessToken: createSession.accessToken,
      refreshToken: createSession.refreshToken,
    };
  }

  async signOut(sessionId: string) {
    const session = await this.authRepository.getSessionByIdOrToken(
      Number(sessionId),
      null
    );
    if (!session) {
      throw new ErrorResponse("Sesión no encontrada", 400);
    }

    const updateSession = {} as Session;
    updateSession.id = session.id;
    updateSession.isActive = false;
    await this.authRepository.updateSession(updateSession);
  }

  async forgotPassword(contact: string, method: OtpType, type: otpTypeAction) {
    const email = method === "email" ? contact : null;
    const phone = method === "sms" ? contact : null;
    const user = await this.userRepository.findUserByEmailOrPhone(email, phone);
    if (!user) {
      throw new ErrorResponse("Usuario no encontrado", 400);
    }

    const newMfa = {
      userId: user.id,
      type,
      otp: generateRandomString(6),
      method,
      expiratedAt: new Date(Date.now() + 5 * 60000),
    } as Mfa;
    await this.authRepository.createMfa(newMfa);

    let response: string = "Se ha enviado un código de verificación al";
    switch (method) {
      case "sms":
        await client.messages.create({
          body: `Hola, has solicitado un código de verificación. Utiliza el
          siguiente ${newMfa.otp}, Si no solicitaste este código, por favor ignora este mensaje.`,
          from: environment.TWILIO_PHONE_NUMBER,
          to: user.phone,
        });
        response = `${response} telefono ${maskString(user.phone)}`;
        break;
      case "email":
        await this.emailRepository.sendEmail({
          data: {
            otp: newMfa.otp,
            year: new Date().getFullYear(),
            fullname: `${user.name} ${user.lastname}`,
            subject:
              type === "login"
                ? "Código de Verificación para Inicio de Sesión"
                : "Código de Verificación para Cambio de Contraseña",
          },
          from: environment.MAIL_FROM,
          subject:
            type === "login"
              ? "Código de Verificación para Inicio de Sesión"
              : "Código de Verificación para Cambio de Contraseña",
          to: user.email,
          template: "sign-in",
        } as Email);
        response = `${response} correo ${maskEmail(user.email)}`;
        break;
    }

    return response;
  }

  async validForgotPassword(
    contact: string,
    otp: string,
    method: OtpType,
    type: otpTypeAction
  ) {
    const { findMfa, user } = await this.validUserAndMfa(
      contact,
      otp,
      method,
      type
    );

    const updateMfa = {
      id: findMfa.id,
      active: false,
      isUsed: true,
    } as Mfa;
    await this.authRepository.updateMfa(updateMfa);

    return user.id;
  }

  async getPublicKey() {
    const publicKey: string = fs.readFileSync(
      `${path.join(process.cwd(), "/keys/publicKey.pem")}`,
      "utf8"
    );
    return {
      publicKey,
      sha256Hash: generateSHA256Hash(publicKey),
    };
  }

  private async validUserAndMfa(
    contact: string,
    otp: string,
    method: OtpType,
    type: otpTypeAction
  ) {
    const email = method === "email" ? contact : null;
    const phone = method === "sms" ? contact : null;
    const user = await this.userRepository.findUserByEmailOrPhone(email, phone);
    if (!user) {
      throw new ErrorResponse("Usuario no encontrado", 400);
    }

    const findMfa = await this.authRepository.getMfaByUser(
      otp,
      user.id,
      type,
      method,
      false,
      true
    );
    if (!findMfa) {
      throw new ErrorResponse("Código de verificación incorrecto", 400);
    }

    if (new Date() > findMfa.expiratedAt) {
      const updateMfa = { id: findMfa.id, active: false } as Mfa;
      await this.authRepository.updateMfa(updateMfa);
      throw new ErrorResponse("El código de verificación ha expirado", 400);
    }

    return { user, findMfa };
  }
}
