import { UserRepository } from "../../../domain/repositories";
import { ErrorResponse } from "../../../shared/helpers";
import { User } from "../../../domain/entities";
import { AppDataSource } from "./DatabaseConnection";
import { errorDatabase } from "../../../shared/utils/DatabaseError.util";
import colors from "colors";

export class PostgresUserRepository implements UserRepository {
  private readonly userRepository = AppDataSource.getRepository(User);

  async createUser(user: User): Promise<User> {
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      console.error(colors.red.bold(error));

      if (error.code === "23505") {
        errorDatabase(error.detail, "No se pudo crear el usuario.");
      }

      throw new ErrorResponse("No se pudo crear el usuario.", 400);
    }
  }

  async updateUser(user: User): Promise<User> {
    try {
      const result = await this.userRepository.update({ id: user.id }, user);
      return result.raw[0];
    } catch (error) {
      console.error(colors.red.bold(error));

      if (error.code === "23505") {
        errorDatabase(error.detail, "No se pudo crear el usuario.");
      }

      throw new ErrorResponse("No se pudo actualizar el usuario.", 400);
    }
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: Number(id) } });
  }

  async findUserByEmailOrPhone(
    email: string | null,
    phone: string | null
  ): Promise<User | null> {
    const whereClause = {} as User;
    if (email !== null) {
      whereClause.email = email;
    }
    if (phone !== null) {
      whereClause.phone = phone;
    }

    return await this.userRepository.findOne({ where: whereClause });
  }

  async findUserByIdentification(identification: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { identification } });
  }
}
