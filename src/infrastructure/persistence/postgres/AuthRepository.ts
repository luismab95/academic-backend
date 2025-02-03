import { User } from "../../../domain/entities/User";
import { AuthRepository } from "../../../domain/repositories/AuthRepository";
import { AppDataSource } from "./DatabaseConnection";

export class PostgresAuthRepository implements AuthRepository {
  private userRepository = AppDataSource.getRepository(User);

  async signIn(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
}
