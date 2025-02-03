import { UserRepository } from "../../../domain/repositories/UserRepository";
import { ErrorResponse } from "../../../shared/helpers/ResponseHelper";
import { User } from "../../../domain/entities/User";
import { AppDataSource } from "./DatabaseConnection";
import colors from "colors";

export class PostgresUserRepository implements UserRepository {
  private userRepository = AppDataSource.getRepository(User);

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

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id: Number(id) } });
  }
}
