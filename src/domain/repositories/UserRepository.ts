import { User } from "../entities";

export interface UserRepository {
  getUserById(id: number): Promise<User | null>;
  findUserByEmailOrPhone(
    email: string | null,
    phone: string | null
  ): Promise<User | null>;
  findUserByIdentification(identification: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
}
