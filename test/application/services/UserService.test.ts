import {
  AuthRepository,
  EmailRepository,
  UserRepository,
} from "../../../src/domain/repositories";
import { UserService } from "../../../src/application/services/UserService";
import { Mfa, User } from "../../../src/domain/entities";
import {
  dateFormat,
  encryptPassword,
  ErrorResponse,
  validateIdentification,
} from "../../../src/shared/helpers";

jest.mock("../../../src/domain/repositories/AuthRepository");
jest.mock("../../../src/shared/helpers", () => ({
  encryptPassword: jest.fn(),
  dateFormat: jest.fn(),
  validateIdentification: jest.fn(),
}));

const user = {
  id: 1,
  email: "luismab95@gmail.com",
  identification: "0202477709",
  password: "123456",
  name: "Luis Manuel",
  lastname: "Barragán González",
  phone: "0983956736",
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

describe("UserService", () => {
  let userRepository: jest.Mocked<UserRepository>;
  let authRepository: jest.Mocked<AuthRepository>;
  let emailRepository: jest.Mocked<EmailRepository>;
  let userService: UserService;

  userRepository = {
    createUser: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
  } as unknown as jest.Mocked<UserRepository>;
  authRepository = {
    getMfaByUser: jest.fn(),
  } as unknown as jest.Mocked<AuthRepository>;
  emailRepository = {
    sendEmail: jest.fn(),
  } as unknown as jest.Mocked<EmailRepository>;
  userService = new UserService(
    userRepository,
    authRepository,
    emailRepository
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user", async () => {
    (encryptPassword as jest.Mock).mockResolvedValue("encryptedPassword");
    (validateIdentification as jest.Mock).mockResolvedValue(true);
    userRepository.createUser.mockResolvedValue(user);

    const newUser = {
      name: user.name,
      lastname: user.lastname,
      identification: user.identification,
      email: user.email,
      password: await encryptPassword(user.password),
    } as User;

    await userService.createUser(
      user.name,
      user.lastname,
      user.email,
      user.password,
      user.identification
    );

    expect(encryptPassword).toHaveBeenCalledWith(user.password);
    expect(newUser.password).toBe("encryptedPassword");
    expect(userRepository.createUser).toHaveBeenCalledWith(newUser);
  });

  it("should return error when user to update no exists", async () => {
    userRepository.getUserById.mockResolvedValue(null);
    await expect(userService.updateUser(1, user)).rejects.toThrow(
      ErrorResponse
    );
    expect(userRepository.getUserById).toHaveBeenCalledWith(1);
    expect(userRepository.updateUser).toHaveBeenCalledTimes(0);
  });

  it("should update a user", async () => {
    userRepository.getUserById.mockResolvedValue(user);
    await userService.updateUser(1, user);
    expect(userRepository.getUserById).toHaveBeenCalledWith(1);
    expect(userRepository.updateUser).toHaveBeenCalledWith(user);
  });

  it("should return a user", async () => {
    userRepository.getUserById.mockResolvedValue(user);
    (dateFormat as jest.Mock).mockReturnValue("2021-09-01 00:00:00");

    const findUser = await userService.getUserById(user.id);

    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id);
    expect(findUser).toEqual(user);
    expect(findUser.createdAt).toEqual("2021-09-01 00:00:00");
    expect(findUser.updatedAt).toEqual("2021-09-01 00:00:00");
  });

  it("should update a user password", async () => {
    userRepository.getUserById.mockResolvedValue(user);
    authRepository.getMfaByUser.mockResolvedValue(mfa);
    (encryptPassword as jest.Mock).mockResolvedValue("encryptedPassword");

    await userService.updatePassword(
      user.id,
      "123456",
      "aD4w",
      "email",
      "forgot-password"
    );

    expect(userRepository.getUserById).toHaveBeenCalledWith(user.id);
    expect(authRepository.getMfaByUser).toHaveBeenCalledWith(
      "aD4w",
      user.id,
      "forgot-password",
      "email",
      true,
      false
    );
    expect(user.password).toBe("encryptedPassword");
    expect(userRepository.updateUser).toHaveBeenCalledWith(user);
  });
});
