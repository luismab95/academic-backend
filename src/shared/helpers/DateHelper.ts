import moment from "moment-timezone";
import environment from "../infrastructure/Environment";

export const DateFormat = (
  date: Date,
  format: string = "YYYY-MM-DD HH:mm:ss"
) => {
  return moment(date).tz(environment.TZ).format(format);
};
