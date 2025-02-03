import { PostgresUserRepository } from "../../infrastructure/persistence/postgres/UserRepository";
import { PostgresAuthRepository } from "../../infrastructure/persistence/postgres/AuthRepository";
import { UserService } from "../../application/services/UserService";
import { AuthService } from "../../application/services/AuthService";

const userRepository = new PostgresUserRepository();
const authRepository = new PostgresAuthRepository();

export const ServiceContainer = {
  user: new UserService(userRepository),
  auth: new AuthService(authRepository),
};
