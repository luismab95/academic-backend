import { User } from "../entities";

export interface UserRepository {
  getUserById(id: number): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
}
