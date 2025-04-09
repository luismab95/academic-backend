import {
  AuthRepository,
  DeviceRepository,
  EmailRepository,
  UserRepository,
} from "../../../src/domain/repositories";
import { AuthService } from "../../../src/application/services/AuthService";
import {
  comparePassword,
  generateRandomString,
  generateSHA256Hash,
  generateToken,
  maskEmail,
} from "../../../src/shared/helpers";
import { Device, Mfa, Session, User } from "../../../src/domain/entities";
import fs from "fs";
import path from "path";

jest.mock("../../../src/domain/repositories/AuthRepository");
jest.mock("../../../src/domain/repositories/EmailRepository");
jest.mock("../../../src/domain/repositories/DeviceRepository");
jest.mock("../../../src/shared/helpers", () => ({
  comparePassword: jest.fn(),
  generateRandomString: jest.fn(),
  generateToken: jest.fn(),
  generateSHA256Hash: jest.fn(),
  maskEmail: jest.fn(),
}));

const user = {
  id: 1,
  email: "luismab95@gmail.com",
  identification: "0202477709",
  password: "$2b$10$E4CjZnNC/Svf28WNULyYNuuD6Tgsjvv9vRo7ohuEzADYJFuq5v5iS",
  name: "Luis Manuel",
  lastname: "Barragán González",
  phone: "0983956736",
  createdAt: "2025-02-04T15:03:53.181Z",
  updatedAt: "2025-02-05T04:15:31.543Z",
} as User;

const mfa = {
  id: 16,
  method: "email",
  type: "forgot-password",
  otp: "ed1P",
  active: false,
  isUsed: true,
  userId: 1,
  expiratedAt: "2025-02-04T21:43:47.144Z",
  createdAt: "2025-02-04T21:38:47.149Z",
  updatedAt: "2025-02-04T21:39:04.546Z",
} as Mfa;

const device = {
  id: 5,
  createdAt: "2025-02-04T23:04:15.789Z",
  name: "Luisma",
  type: "mobile phone",
  operationSystem: "Iphone 12 Pro Max",
  version: "18.2.1",
  serie: "F2LDNVSU0D4C",
} as Device;

const session = {
  id: 5,
  accessToken:
    "3QPQPci0lppIVcxjSBDKdvlRbcn9zuQ2Q1UP4GFWtoUuD5ZiQf5HYiWuZNJpOsw57xw0mR9WoP8JX6efX1YQm2dQS3Fmhqmt2qbT2rpllT2g6Y1HZjCYIrx2FeKrnLCjypUXMwThaVCLkKwV7vxDMm24AwZ4xXyG714ysHhIV5eCO75uQjVxDNqGC25wxpPQpwfZkvHGE2pI4WsdfaBEl0d8SbJkQcB0Da4pAVfmCe3bSjtV4jPLkiURe2d8v6p",
  refreshToken:
    "PtZkAZ9fbhTQmElNR44UDyAFqCpgLCkA4l6TfuqnMLWdp1jbRLjFbVr9peCrZgKO8nU8X0X0CyYNtdkEyNxv77SeiOZJjApKasApOADQoiWBPufijD9VQ5XMFAUy8UlWQNQ2DmgfRylc6uw86dJ0VrZgg7zAukNlYo89RdZn9DueR7oWi33PjdLOhjjgij6dHdyWBiypqDHx8hoB9OtgvQv2xI1CM4QM1hdybMhC7pJaGQ40RjVhZhhvkliqji7",
  originIp: "192.168.1.13",
  isActive: false,
  userId: 1,
  createdAt: "2025-02-04T19:05:04.979Z",
  updatedAt: "2025-02-04T20:23:11.788Z",
  expiratedAt: "2025-02-05T19:05:04.972Z",
  deviceId: 2,
} as Session;

describe("AuthService", () => {
  let authRepository: jest.Mocked<AuthRepository>;
  let emailRepository: jest.Mocked<EmailRepository>;
  let deviceRepository: jest.Mocked<DeviceRepository>;
  let userRepository: jest.Mocked<UserRepository>;
  let authService: AuthService;

  authRepository = {
    signIn: jest.fn(),
    createMfa: jest.fn(),
    getMfaByUser: jest.fn(),
    updateMfa: jest.fn(),
    createSession: jest.fn(),
    getSessionByIdOrToken: jest.fn(),
    updateSession: jest.fn(),
    findBloquedUser: jest.fn(),
    updateBloquedUser: jest.fn(),
    createBloquedUser: jest.fn(),
    findAuthAttempt: jest.fn(),
    updateAllActiveAuthAttempt: jest.fn(),
    updateAuthAttempt: jest.fn(),
    createAuthAttempt: jest.fn(),
    
  } as unknown as jest.Mocked<AuthRepository>;
  emailRepository = {
    sendEmail: jest.fn(),
  } as jest.Mocked<EmailRepository>;
  deviceRepository = {
    findDeviceBySerie: jest.fn(),
  } as unknown as jest.Mocked<DeviceRepository>;
  userRepository = {
    findUserByEmailOrPhone: jest.fn(),
  } as unknown as jest.Mocked<UserRepository>;
  authService = new AuthService(
    authRepository,
    emailRepository,
    deviceRepository,
    userRepository
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should valid a signIn", async () => {
    authRepository.signIn.mockResolvedValue(user);
    (comparePassword as jest.Mock).mockResolvedValue(true);
    (maskEmail as jest.Mock).mockReturnValue("luis*****@g****");
    (generateRandomString as jest.Mock).mockReturnValue("1234");
    authRepository.createMfa.mockResolvedValue(mfa);

    const response = await authService.signIn(user.email, "123456");

    expect(authRepository.signIn).toHaveBeenCalledWith(user.email);
    expect(comparePassword).toHaveBeenCalledWith("123456", user.password);
    expect(maskEmail).toHaveBeenCalledWith(user.email);
    expect(authRepository.createMfa).toHaveBeenCalledTimes(1);
    expect(emailRepository.sendEmail).toHaveBeenCalledTimes(1);
    expect(response).toBe(
      `Se ha enviado un código de verificación al correo luis*****@g****`
    );
  });

  it("should valid a signInMfa", async () => {
    userRepository.findUserByEmailOrPhone.mockResolvedValue(user);
    authRepository.getMfaByUser.mockResolvedValue(mfa);
    deviceRepository.findDeviceBySerie.mockResolvedValue(device);
    authRepository.createSession.mockResolvedValue(session);
    (generateToken as jest.Mock).mockReturnValue("token");

    const response = await authService.signInMfa(
      user.email,
      mfa.otp,
      "email",
      device.serie,
      "0.0.0.0"
    );

    expect(userRepository.findUserByEmailOrPhone).toHaveBeenCalledTimes(1);
    expect(authRepository.getMfaByUser).toHaveBeenCalledTimes(1);
    expect(deviceRepository.findDeviceBySerie).toHaveBeenCalledWith(
      device.serie
    );
    expect(generateToken).toHaveBeenCalledTimes(2);
    expect(authRepository.createSession).toHaveBeenCalledTimes(1);
    expect(authRepository.updateMfa).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      sessionId: session.id,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    });
  });

  it("should close session", async () => {
    authRepository.getSessionByIdOrToken.mockResolvedValue(session);
    authRepository.updateSession.mockResolvedValue(session);

    await authService.signOut(String(session.id));

    expect(authRepository.getSessionByIdOrToken).toHaveBeenCalledWith(
      session.id,
      null
    );
    expect(authRepository.updateSession).toHaveBeenCalledTimes(1);
    expect(authRepository.updateSession).toHaveBeenCalledWith({
      id: session.id,
      isActive: false,
    });
  });

  it("should valid a generate forgotPassword", async () => {
    userRepository.findUserByEmailOrPhone.mockResolvedValue(user);
    (generateRandomString as jest.Mock).mockReturnValue("1234");
    (maskEmail as jest.Mock).mockReturnValue("luis*****@g****");
    authRepository.createMfa.mockResolvedValue(mfa);

    const response = await authService.forgotPassword(user.email, "email", 'forgot-password');

    expect(userRepository.findUserByEmailOrPhone).toHaveBeenCalledTimes(1);
    expect(generateRandomString).toHaveBeenCalledTimes(1);
    expect(authRepository.createMfa).toHaveBeenCalledTimes(1);
    expect(emailRepository.sendEmail).toHaveBeenCalledTimes(1);
    expect(response).toBe(
      `Se ha enviado un código de verificación al correo luis*****@g****`
    );
  });

  it("should valid a forgotPassword", async () => {
    userRepository.findUserByEmailOrPhone.mockResolvedValue(user);
    authRepository.getMfaByUser.mockResolvedValue(mfa);

    await authService.validForgotPassword(user.email, "12DAS", "email", 'forgot-password');

    expect(userRepository.findUserByEmailOrPhone).toHaveBeenCalledTimes(1);
    expect(authRepository.getMfaByUser).toHaveBeenCalledTimes(1);
    expect(authRepository.updateMfa).toHaveBeenCalledTimes(1);
  });

  it("should return a public key", async () => {
    (generateSHA256Hash as jest.Mock).mockReturnValue("publicKey");
    const publicKey: string = fs.readFileSync(
      `${path.join(process.cwd(), "/keys/publicKey.pem")}`,
      "utf8"
    );

    const response = await authService.getPublicKey();

    expect(response).toEqual({ publicKey, sha256Hash: "publicKey" });
  });
});
