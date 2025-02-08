import { Email } from "../entities";

export interface EmailRepository {
  sendEmail(email: Email): Promise<void>;
}
