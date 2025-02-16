import { Repository } from "typeorm";
import { User } from "../../../../src/domain/entities";
import { PostgresUserRepository } from "../../../../src/infrastructure/persistence/postgres/UserRepository";
import { AppDataSource } from "../../../../src/infrastructure/persistence/postgres/DatabaseConnection";

jest.mock(
  "../../../../src/infrastructure/persistence/postgres/DatabaseConnection"
);

describe("UserRepository", () => {
  let userRepository: PostgresUserRepository;
  let mockRepository: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    mockRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
    userRepository = new PostgresUserRepository();
  });

  describe("getUserById", () => {
    it("should return the user by ID", async () => {
      const user = new User();
      user.id = 1;
      user.name = "John Doe";
      user.email = "example@me";

      mockRepository.findOne.mockResolvedValue(user);

      const result = await userRepository.getUserById(user.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: user.id },
      });
      expect(result).toEqual(user);
    });

    it("should return null if the user does not exist", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await userRepository.getUserById(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBeNull();
    });
  });

  describe("createUser", () => {
    it("should create a user and return it", async () => {
      const user = new User();
      user.id = 1;
      user.name = "John Doe";
      user.email = "example@me";

      mockRepository.save.mockResolvedValue(user);

      const result = await userRepository.createUser(user);

      expect(mockRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it("should throw an error if the email already exists", async () => {
      const user = new User();
      user.id = 1;
      user.name = "John Doe";
      user.email = "example@me";

      const error = new Error() as any;
      error.code = "23505";
      error.detail = "email";

      mockRepository.save.mockRejectedValue(error);

      await expect(userRepository.createUser(user)).rejects.toThrow(
        "Correo Electrónico ya existe"
      );

      expect(mockRepository.save).toHaveBeenCalledWith(user);
    });

    it("should throw an generic error if creation falied", async () => {
      const user = new User();
      user.id = 1;
      user.name = "John Doe";
      user.email = "example@me";
      const error = new Error("Some error");

      mockRepository.save.mockRejectedValue(error);

      await expect(userRepository.createUser(user)).rejects.toThrow(
        "No se pudo crear el usuario."
      );
      expect(mockRepository.save).toHaveBeenCalledWith(user);
    });
  });

  describe("updateUser", () => {
    it("should update a user and return it", async () => {
      const user = new User();
      user.id = 1;
      user.email = "example@me";
      user.name = "John Doe";
      const rawResult = [{ ...user }];

      mockRepository.update.mockResolvedValue({ raw: rawResult } as any);

      const result = await userRepository.updateUser(user);

      expect(mockRepository.update).toHaveBeenCalledWith({ id: user.id }, user);
      expect(result).toEqual(rawResult[0]);
    });

    it("should throw an error if the email already exists", async () => {
      const user = new User();
      user.id = 1;
      user.email = "example@me";
      user.name = "John Doe";

      const error = new Error() as any;
      error.code = "23505";
      error.detail = "email";

      mockRepository.update.mockRejectedValue(error);

      await expect(userRepository.updateUser(user)).rejects.toThrow(
        "Correo Electrónico ya existe"
      );

      expect(mockRepository.update).toHaveBeenCalledWith({ id: user.id }, user);
    });

    it("should throw an generic error if update falied", async () => {
      const user = new User();
      user.id = 1;
      user.email = "example@me";
      user.name = "John Doe";
      const error = new Error("Some error");

      mockRepository.update.mockRejectedValue(error);

      await expect(userRepository.updateUser(user)).rejects.toThrow(
        "No se pudo actualizar el usuario."
      );
      expect(mockRepository.update).toHaveBeenCalledWith({ id: user.id }, user);
    });
  });

  describe("findUserByEmailOrPhone", () => {
    it("should return the user by email", async () => {
      const user = new User();
      user.id = 1;
      user.name = "John Doe";
      user.email = "example@me";

      mockRepository.findOne.mockResolvedValue(user);

      const result = await userRepository.findUserByEmailOrPhone(
        user.email,
        null
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: user.email },
      });
      expect(result).toEqual(user);
    });

    it("should return the user by phone", async () => {
      const user = new User();
      user.id = 1;
      user.name = "John Doe";
      user.phone = "1234567890";

      mockRepository.findOne.mockResolvedValue(user);

      const result = await userRepository.findUserByEmailOrPhone(
        null,
        user.phone
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { phone: user.phone },
      });
      expect(result).toEqual(user);
    });

    it("should return null if the user does not exist", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await userRepository.findUserByEmailOrPhone(
        "example@me",
        null
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: "example@me" },
      });
      expect(result).toBeNull();
    });
  });
});
