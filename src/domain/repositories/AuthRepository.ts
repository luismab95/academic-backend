import { User } from "../entities/User";

export interface AuthRepository {
  signIn(email: string): Promise<User | undefined>;
}
