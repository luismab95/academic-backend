import {
  PostgresUserRepository,
  PostgresAuthRepository,
  PostgreDeviceRepository,
  PostgresPublicKeyRepository,
} from "../../infrastructure/persistence/postgres";
import { NodemailerEmailRepository } from "../../infrastructure/adapters/nodemailer/EmailRepository";
import {
  UserService,
  AuthService,
  DeviceService,
  AcademicService,
} from "../../application/services";
import { ExternalAcademicRepository } from "../../infrastructure/persistence/externalServices/ExternalAcademicRepository";

const userRepository = new PostgresUserRepository();
const authRepository = new PostgresAuthRepository();
const deviceRepository = new PostgreDeviceRepository();
const publicKeyRepository = new PostgresPublicKeyRepository();
const emailRepository = new NodemailerEmailRepository();
const academicRepository = new ExternalAcademicRepository();

export const ServiceContainer = {
  user: new UserService(userRepository, authRepository, emailRepository),
  auth: new AuthService(
    authRepository,
    emailRepository,
    deviceRepository,
    userRepository
  ),
  device: new DeviceService(deviceRepository, publicKeyRepository),
  academic: new AcademicService(
    academicRepository,
    userRepository,
    emailRepository
  ),
};
