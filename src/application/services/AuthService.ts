import fs from "fs";
import path from "path";
import { ErrorResponse } from "../../shared/helpers/ResponseHelper";
import environment from "../../shared/infrastructure/Environment";
import {
  comparePassword,
  generateRandomString,
  generateSHA256Hash,
  generateToken,
} from "../../shared/helpers/";
import { AuthRepository, EmailRepository } from "../../domain/repositories";
import { Email, Mfa, OtpType, Session } from "../../domain/entities";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailRepository: EmailRepository
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.authRepository.signIn(email);
    if (!user) {
      throw new ErrorResponse("Usuario no encontrado", 400);
    }

    const verifyPassword = await comparePassword(password, user.password);

    if (!verifyPassword) {
      throw new ErrorResponse("Contraseña incorrecta", 400);
    }

    const newMfa = {
      userId: user.id,
      type: "login",
      otp: generateRandomString(4),
      expiratedAt: new Date(Date.now() + 5 * 60000),
    } as Mfa;
    await this.authRepository.createMfa(newMfa);

    await this.emailRepository.sendEmail({
      data: {
        otp: newMfa.otp,
        year: new Date().getFullYear(),
        fullname: `${user.name} ${user.lastname}`,
        subject: "Codigo de verificación para inicio de sesión",
      },
      from: environment.MAIL_FROM,
      subject: "Codigo de verificación para inicio de sesión",
      to: user.email,
      template: "mfa",
    } as Email);

    return `Se ha enviado un código de verificación al correo ${user.email}`;
  }

  async signInMfa(
    email: string,
    otp: string,
    method: OtpType,
    device: string,
    clientIp: string
  ) {
    const user = await this.authRepository.signIn(email);
    if (!user) {
      throw new ErrorResponse("Usuario no encontrado", 400);
    }

    const findMfa = await this.authRepository.getMfaByUser(
      otp,
      user.id,
      "login",
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

    const deviceInfo = await this.authRepository.getDeviceBySerie(device);
    if (!deviceInfo) {
      throw new ErrorResponse(
        "No se encontro información del dispositivo",
        400
      );
    }

    const newSession = {
      userId: user.id,
      accessToken: generateToken({ userId: user.id, email: user.email }, "1h"),
      refreshToken: generateToken(
        { userId: user.id, email: user.email },
        "30d"
      ),
      deviceId: deviceInfo.id,
      originIp: clientIp,
      expiratedAt: new Date(Date.now() + 24 * 60 * 60000),
    } as Session;
    const createSession = await this.authRepository.createSession(newSession);

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

  async forgotPassword(email: string, method: OtpType) {
    const user = await this.authRepository.signIn(email);
    if (!user) {
      throw new ErrorResponse("Usuario no encontrado", 400);
    }

    const newMfa = {
      userId: user.id,
      type: "forgot-password",
      otp: generateRandomString(4),
      method,
      expiratedAt: new Date(Date.now() + 5 * 60000),
    } as Mfa;
    await this.authRepository.createMfa(newMfa);

    let response: string = "Se ha enviado un código de verificación al";
    switch (method) {
      case "sms":
        response = `${response} telefono ${user.phone}`;
        break;
      case "email":
        await this.emailRepository.sendEmail({
          data: {
            otp: newMfa.otp,
            year: new Date().getFullYear(),
            fullname: `${user.name} ${user.lastname}`,
            subject: "Codigo de verificación para cambio de contraseña",
          },
          from: environment.MAIL_FROM,
          subject: "Codigo de verificación para cambio de contraseña",
          to: user.email,
          template: "mfa",
        } as Email);
        response = `${response} correo ${user.email}`;
        break;
    }

    return response;
  }

  async validForgotPassword(email: string, otp: string, method: OtpType) {
    const user = await this.authRepository.signIn(email);
    if (!user) {
      throw new ErrorResponse("Usuario no encontrado", 400);
    }

    const findMfa = await this.authRepository.getMfaByUser(
      otp,
      user.id,
      "forgot-password",
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

    const updateMfa = { id: findMfa.id, active: false, isUsed: true } as Mfa;
    await this.authRepository.updateMfa(updateMfa);
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
}
