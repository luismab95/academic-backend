export class SignIn {
  email: string;
  password: string;
}

export class SignInMfa {
  method: OtpType;
  email: string;
  otp: string;
  device: string;
}

export type OtpType = "email" | "sms";
export type otpTypeAction = "login" | "reset-password" | "forgot-password";

export class SignUp {
  name: string;
  lastname: string;
  identification: string;
  email: string;
  password: string;
}
