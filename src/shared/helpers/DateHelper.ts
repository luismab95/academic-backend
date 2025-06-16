import moment from "moment-timezone";
import environment from "../infrastructure/Environment";

moment.locale("es-EC");

export const dateFormat = (
  date: Date,
  format: string = "YYYY-MM-DD HH:mm:ss"
) => {
  return moment(date).tz(environment.TZ).format(format);
};
