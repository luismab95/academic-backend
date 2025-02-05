import { User, Mfa, OtpType, Session } from "../../../domain/entities/";
import { AuthRepository } from "../../../domain/repositories";
import { AppDataSource } from "./DatabaseConnection";

export class PostgresAuthRepository implements AuthRepository {
  private userRepository = AppDataSource.getRepository(User);
  private mfaRepository = AppDataSource.getRepository(Mfa);
  private sessionRepository = AppDataSource.getRepository(Session);

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

  async getMfaByUser(
    otp: string,
    userId: number,
    type: "login" | "forgot-password",
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
