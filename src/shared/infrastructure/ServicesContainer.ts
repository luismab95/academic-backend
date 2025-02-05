import {
  PostgresUserRepository,
  PostgresAuthRepository,
  PostgreDeviceRepository,
  PostgresPublicKeyRepository,
} from "../../infrastructure/persistence/postgres";
import { NodemailerEmailRepository } from "../../infrastructure/persistence/nodemailer/EmailRepository";
import {
  UserService,
  AuthService,
  DeviceService,
} from "../../application/services";

const userRepository = new PostgresUserRepository();
const authRepository = new PostgresAuthRepository();
const deviceRepository = new PostgreDeviceRepository();
const publicKeyRepository = new PostgresPublicKeyRepository();
const emailRepository = new NodemailerEmailRepository();

export const ServiceContainer = {
  user: new UserService(userRepository, authRepository),
  auth: new AuthService(authRepository, emailRepository),
  device: new DeviceService(deviceRepository, publicKeyRepository),
};
