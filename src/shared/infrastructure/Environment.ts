import dotenv from "dotenv";

dotenv.config();

const environment = {
  HOST: process.env.HOST || "localhost",
  PORT: Number(process.env.PORT || 3000),
  DATABASE_HOST: process.env.DATABASE_HOST || "",
  DATABASE_PORT: Number(process.env.DATABASE_PORT || "5432"),
  DATABASE_USERNAME: process.env.DATABASE_USERNAME || "",
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || "",
  DATABASE_DBNAME: process.env.DATABASE_DBNAME || "",
  TZ: process.env.TZ || "America/Guayaquil",
};

export default environment;
