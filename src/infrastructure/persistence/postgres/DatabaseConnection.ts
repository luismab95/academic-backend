import {
  User,
  Mfa,
  Device,
  Session,
  PublicKey,
  AuthAttempt,
  BloquedUser,
  Certificate,
  CertificateCodeRef,
} from "../../../domain/entities";
import environment from "../../../shared/infrastructure/Environment";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: environment.DATABASE_HOST,
  port: environment.DATABASE_PORT,
  username: environment.DATABASE_USERNAME,
  password: environment.DATABASE_PASSWORD,
  database: environment.DATABASE_DBNAME,
  entities: [
    User,
    Mfa,
    Session,
    Device,
    PublicKey,
    AuthAttempt,
    BloquedUser,
    Certificate,
    CertificateCodeRef
  ],
  synchronize: true,
  logging: false,
});
