import { ErrorResponse } from "../../shared/helpers/ResponseHelper";
import { ComparePassword } from "../../shared/helpers/EncryptHelper";
import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { OtpType } from "src/domain/entities/Auth";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async signIn(email: string, password: string) {
    const user = await this.authRepository.signIn(email);
    if (!user) {
      throw new ErrorResponse("Usuario no encontrado", 400);
    }

    const verifyPassword = await ComparePassword(password, user.password);

    if (!verifyPassword) {
      throw new ErrorResponse("Contraseña incorrecta", 400);
    }

    //TODO GENERAR OTP
    //TODO ENVIAR CORREO

    return `Se ha enviado un código de verificación al correo ${user.email}`;
  }

  async signInMfa(email: string, otp: string, type: OtpType) {
    //TODO VERIFICAR OTP
    //TODO GENERAR SESION
    //TODO DEVOLVER TOKEN
    return "Usuario autenticado correctamente";
  }

  async signOut(sessionId: string) {
    //TODO ELIMINAR SESION
  }
}
