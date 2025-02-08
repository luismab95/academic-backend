import { OtpType, User } from "../../domain/entities";
import { UserRepository, AuthRepository } from "../../domain/repositories";
import {
  encryptPassword,
  dateFormat,
  ErrorResponse,
} from "../../shared/helpers";

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository
  ) {}

  async createUser(
    name: string,
    lastname: string,
    email: string,
    password: string,
    identification: string
  ) {
    const encryptedPassword = await encryptPassword(password);
    const newUser = {
      name,
      lastname,
      identification,
      email,
      password: encryptedPassword,
    } as User;

    return await this.userRepository.createUser(newUser);
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
    method: OtpType
  ) {
    const userExists = await this.userRepository.getUserById(userId);
    if (!userExists) {
      throw new ErrorResponse("Usuario no encontrado", 400);
    }

    const findMfa = await this.authRepository.getMfaByUser(
      otp,
      userExists.id,
      "forgot-password",
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
