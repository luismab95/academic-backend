import { UserRepository } from "../../../domain/repositories";
import { ErrorResponse } from "../../../shared/helpers";
import { User } from "../../../domain/entities";
import { AppDataSource } from "./DatabaseConnection";
import colors from "colors";

export class PostgresUserRepository implements UserRepository {
  private readonly userRepository = AppDataSource.getRepository(User);

  async createUser(user: User): Promise<User> {
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      console.error(colors.red.bold(error));

      if (error.code === "23505") {
        switch (true) {
          case error.detail.includes("email"):
            throw new ErrorResponse("Correo Electrónico ya existe", 409);
          case error.detail.includes("identification"):
            throw new ErrorResponse("Cédula ya existe.", 409);
          case error.detail.includes("phone"):
            throw new ErrorResponse("Teléfono ya existe.", 409);
        }
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
        switch (true) {
          case error.detail.includes("email"):
            throw new ErrorResponse("Correo Electrónico ya existe", 409);
          case error.detail.includes("identification"):
            throw new ErrorResponse("Cédula ya existe.", 409);
          case error.detail.includes("phone"):
            throw new ErrorResponse("Teléfono ya existe.", 409);
        }
      }

      throw new ErrorResponse("No se pudo actualizar el usuario.", 400);
    }
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: Number(id) } });
  }
}
