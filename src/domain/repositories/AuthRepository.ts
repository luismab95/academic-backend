import {
  AuthAttempt,
  BloquedUser,
  Mfa,
  OtpType,
  otpTypeAction,
  Session,
  User,
} from "../entities";

export interface AuthRepository {
  signIn(email: string): Promise<User | null>;
  createMfa(mfa: Mfa): Promise<Mfa>;
  updateMfa(mfa: Mfa): Promise<Mfa>;
  createAuthAttempt(authAttempt: AuthAttempt): Promise<AuthAttempt>;
  updateAuthAttempt(authAttempt: AuthAttempt): Promise<AuthAttempt>;
  updateAllActiveAuthAttempt(userId: number): Promise<void>;
  findAuthAttempt(userId: number): Promise<AuthAttempt | null>;
  createBloquedUser(bloquedUser: BloquedUser): Promise<BloquedUser>;
  updateBloquedUser(bloquedUser: BloquedUser): Promise<BloquedUser>;
  findBloquedUser(userId: number): Promise<BloquedUser | null>;
  getMfaByUser(
    otp: string,
    userId: number,
    type: otpTypeAction,
    method: OtpType,
    isUsed: boolean,
    active: boolean
  ): Promise<Mfa | null>;
  createSession(session: Session): Promise<Session>;
  updateSession(session: Session): Promise<Session>;
  getSessionByIdOrToken(
    id: number | null,
    token: string | null
  ): Promise<Session | null>;
}
