import { User } from "../../../domain/entities/User";
import environment from "../../../shared/infrastructure/Environment";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: environment.DATABASE_HOST,
  port: environment.DATABASE_PORT,
  username: environment.DATABASE_USERNAME,
  password: environment.DATABASE_PASSWORD,
  database: environment.DATABASE_DBNAME,
  entities: [User],
  synchronize: true,
  logging: true,
});
