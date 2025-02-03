export class SignIn {
  email: string;
  password: string;
}

export class SignInMfa {
  type: OtpType;
  email: string;
  otp: string;
}

export type OtpType = "email" | "sms";

export class SignUp {
  name: string;
  lastname: string;
  identification: string;
  email: string;
  password: string;
}

