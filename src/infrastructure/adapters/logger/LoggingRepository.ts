import moment from "moment-timezone";
import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

const customFormat = printf(({ level, message, timestamp }) => {
  const formattedTimestamp = moment(timestamp).format("yyyy-MM-dd HH:mm:ss");
  const formattedMessage =
    typeof message === "object" ? JSON.stringify(message) : message.toString();

  return `[${formattedTimestamp}] ${level}: ${formattedMessage}`;
});

const logger = createLogger({
  level: "debug",
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    customFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: `${process.cwd()}/logs/error.log`,
      level: "error",
    }),
  ],
});

export default logger;
