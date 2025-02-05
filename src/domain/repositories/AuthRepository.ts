import { Device, Mfa, OtpType, Session, User } from "../entities";

export interface AuthRepository {
  signIn(email: string): Promise<User | undefined>;
  createMfa(mfa: Mfa): Promise<Mfa>;
  updateMfa(mfa: Mfa): Promise<Mfa>;
  getMfaByUser(
    otp: string,
    userId: number,
    type: "login" | "forgot-password",
    method: OtpType,
    isUsed: boolean,
    active: boolean
  ): Promise<Mfa | undefined>;
  createSession(session: Session): Promise<Session>;
  updateSession(session: Session): Promise<Session>;
  getSessionByIdOrToken(
    id: number | null,
    token: string | null
  ): Promise<Session | undefined>;
  getDeviceBySerie(serie: string): Promise<Device | undefined>;
}
