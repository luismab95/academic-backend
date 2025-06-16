import { Email, OtpType, otpTypeAction, User } from "../../domain/entities";
import {
  UserRepository,
  AuthRepository,
  EmailRepository,
} from "../../domain/repositories";
import {
  encryptPassword,
  dateFormat,
  ErrorResponse,
  validateIdentification,
} from "../../shared/helpers";
import environment from "../../shared/infrastructure/Environment";

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly emailRepository: EmailRepository
  ) {}

  async createUser(
    name: string,
    lastname: string,
    email: string,
    password: string,
    identification: string
  ) {
    const verifyIdentification = validateIdentification(identification);
    if (!verifyIdentification)
      throw new ErrorResponse("Número de identificaciòn no válido.", 400);

    const encryptedPassword = await encryptPassword(password);
    const newUser = {
      name,
      lastname,
      identification,
      email,
      password: encryptedPassword,
    } as User;

    const createdUser = await this.userRepository.createUser(newUser);

    this.emailRepository.sendEmail({
      data: {
        year: new Date().getFullYear(),
        fullname: `${createdUser.name} ${createdUser.lastname}`,
        subject: `Bienvenido a ${environment.MAIL_NAME}`,
      },
      from: environment.MAIL_FROM,
      subject: `Bienvenido a ${environment.MAIL_NAME}`,
      to: createdUser.email,
      template: "sign-up",
    } as Email);

    return createdUser;
  }

  async updateUser(id: number, user: User) {
    const userExists = await this.userRepository.getUserById(id);

    if (!userExists) {
      throw new ErrorResponse("Usuario no encontrado", 400);
    }

    user.id = userExists.id;
    await this.userRepository.updateUser(user);
  }

  async updatePassword(
    userId: number,
    password: string,
    otp: string,
    method: OtpType,
    type: otpTypeAction
  ) {
    const userExists = await this.userRepository.getUserById(userId);
    if (!userExists) {
      throw new ErrorResponse("Usuario no encontrado", 400);
    }

    const findMfa = await this.authRepository.getMfaByUser(
      otp,
      userExists.id,
      type,
      method,
      true,
      false
    );
    if (!findMfa) {
      throw new ErrorResponse("Codigo de verificación incorrecto", 400);
    }

    userExists.password = await encryptPassword(password);
    await this.userRepository.updateUser(userExists);
  }

  async getUserById(id: number) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new ErrorResponse("Usuario no encontrado", 400);
    }

    user.createdAt = dateFormat(user.createdAt as Date);
    user.updatedAt = dateFormat(user.updatedAt as Date);
    delete user.password;

    return user;
  }
}
