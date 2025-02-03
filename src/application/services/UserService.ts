import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { EncryptPassword } from "../../shared/helpers/EncryptHelper";
import { DateFormat } from "../../shared/helpers/DateHelper";
import { ErrorResponse } from "../../shared/helpers/ResponseHelper";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(
    name: string,
    lastname: string,
    email: string,
    password: string,
    identification: string
  ) {
    const encrypPassword = await EncryptPassword(password);
    const newUser = {
      name,
      lastname,
      identification,
      email,
      password: encrypPassword,
    } as User;

    return await this.userRepository.createUser(newUser);
  }

  async getUserById(id: string) {
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new ErrorResponse("Usuario no encontrado", 400);
    }

    user.createdAt = DateFormat(user.createdAt as Date);
    user.updatedAt = DateFormat(user.updatedAt as Date);
    delete user.password;
    
    return user;
  }
}
