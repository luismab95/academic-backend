import {
  User,
  Mfa,
  OtpType,
  Session,
  otpTypeAction,
  AuthAttempt,
  BloquedUser,
} from "../../../domain/entities/";
import { AuthRepository } from "../../../domain/repositories";
import { AppDataSource } from "./DatabaseConnection";

export class PostgresAuthRepository implements AuthRepository {
  private readonly userRepository = AppDataSource.getRepository(User);
  private readonly mfaRepository = AppDataSource.getRepository(Mfa);
  private readonly sessionRepository = AppDataSource.getRepository(Session);
  private readonly authAttemptRepository =
    AppDataSource.getRepository(AuthAttempt);
  private readonly bloquedUserRepository =
    AppDataSource.getRepository(BloquedUser);

  async signIn(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async createMfa(mfa: Mfa): Promise<Mfa> {
    return await this.mfaRepository.save(mfa);
  }

  async updateMfa(mfa: Mfa): Promise<Mfa> {
    const result = await this.mfaRepository.update({ id: mfa.id }, mfa);
    return result.raw[0];
  }

  async createAuthAttempt(authAttempt: AuthAttempt): Promise<AuthAttempt> {
    return await this.authAttemptRepository.save(authAttempt);
  }

  async updateAuthAttempt(authAttempt: AuthAttempt): Promise<AuthAttempt> {
    const result = await this.authAttemptRepository.update(
      { id: authAttempt.id },
      authAttempt
    );
    return result.raw[0];
  }

  async updateAllActiveAuthAttempt(userId: number): Promise<void> {
    await this.authAttemptRepository.update(
      { userId: userId, isActive: true },
      { isActive: false }
    );
  }

  async findAuthAttempt(userId: number): Promise<AuthAttempt | null> {
    return await this.authAttemptRepository.findOne({
      where: { userId, isActive: true },
      order: { createdAt: "DESC" },
    });
  }

  async createBloquedUser(bloquedUser: BloquedUser): Promise<BloquedUser> {
    return await this.bloquedUserRepository.save(bloquedUser);
  }

  async updateBloquedUser(bloquedUser: BloquedUser): Promise<BloquedUser> {
    const result = await this.bloquedUserRepository.update(
      { id: bloquedUser.id },
      bloquedUser
    );
    return result.raw[0];
  }

  async findBloquedUser(userId: number): Promise<BloquedUser | null> {
    return await this.bloquedUserRepository.findOne({
      where: { userId, isActive: true },
      order: { createdAt: "DESC" },
    });
  }

  async getMfaByUser(
    otp: string,
    userId: number,
    type: otpTypeAction,
    method: OtpType,
    isUsed: boolean,
    active: boolean
  ): Promise<Mfa | null> {
    return await this.mfaRepository.findOne({
      where: { otp, userId, active, isUsed, type, method },
    });
  }

  async getSessionByIdOrToken(
    id: number | null,
    token: string | null
  ): Promise<Session | null> {
    const whereClause = {} as Session;
    if (id !== null) {
      whereClause.id = id;
    }
    if (token !== null) {
      whereClause.accessToken = token;
    }

    return await this.sessionRepository.findOne({ where: whereClause });
  }

  async createSession(session: Session): Promise<Session> {
    return await this.sessionRepository.save(session);
  }

  async updateSession(session: Session): Promise<Session> {
    const result = await this.sessionRepository.update(
      { id: session.id },
      session
    );
    return result.raw[0];
  }
}
