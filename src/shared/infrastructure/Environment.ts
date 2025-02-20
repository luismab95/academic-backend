import dotenv from "dotenv";

dotenv.config();

const environment = {
  HOST: process.env.HOST || "localhost",
  PORT: Number(process.env.PORT || 3000),
  NODE_ENV: process.env.NODE_ENV || "development",
  ENABLE_CRYPT_E2E: process.env.ENABLE_CRYPT_E2E === "true",
  DATABASE_HOST: process.env.DATABASE_HOST || "",
  DATABASE_PORT: Number(process.env.DATABASE_PORT || "5432"),
  DATABASE_USERNAME: process.env.DATABASE_USERNAME || "",
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || "",
  DATABASE_DBNAME: process.env.DATABASE_DBNAME || "",
  TZ: process.env.TZ || "America/Guayaquil",
  MAIL_USER: process.env.MAIL_USER || "",
  MAIL_PASSWORD: process.env.MAIL_PASSWORD || "",
  MAIL_FROM: process.env.MAIL_FROM || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  CRYPTO_SECRET: process.env.CRYPTO_SECRET || "",
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || "",
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "",
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || "",
  ACADEMIC_SERVICE: process.env.ACADEMIC_SERVICE || "",
};

export default environment;
