import { Repository } from "typeorm";
import { Mfa, Session, User } from "../../../../src/domain/entities/";
import {
  PostgresAuthRepository,
  AppDataSource,
} from "../../../../src/infrastructure/persistence/postgres/";

jest.mock(
  "../../../../src/infrastructure/persistence/postgres/DatabaseConnection"
);

describe("PostgresAuthRepository", () => {
  let postgresAuthRepository: PostgresAuthRepository;
  let mockRepository: jest.Mocked<Repository<any>>;

  beforeEach(() => {
    mockRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<Repository<any>>;
    AppDataSource.getRepository = jest.fn().mockReturnValue(mockRepository);
    postgresAuthRepository = new PostgresAuthRepository();
  });

  describe("signIn", () => {
    it("should return a user by email", async () => {
      const mockUser = { id: 1, email: "example@me" } as User;

      mockRepository.findOne.mockResolvedValue(mockUser);

      const response = await postgresAuthRepository.signIn("example@me");

      expect(response).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it("should return undefined if user not found", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const response = await postgresAuthRepository.signIn("example@me");
      expect(response).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe("createMfa", () => {
    it("should create a mfa", async () => {
      const mockMfa = { id: 1, otp: "1fsf" } as Mfa;

      mockRepository.save.mockResolvedValue(mockMfa);

      const response = await postgresAuthRepository.createMfa(mockMfa);

      expect(response).toEqual(mockMfa);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateMfa", () => {
    it("should update a mfa", async () => {
      const mockMfa = { id: 1, otp: "1fsf" } as Mfa;
      const resultRaw = [{ ...mockMfa }];

      mockRepository.update.mockResolvedValue({
        raw: resultRaw,
      } as any);

      const response = await postgresAuthRepository.updateMfa(mockMfa);

      expect(response).toEqual(mockMfa);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe("getMfaByUser", () => {
    it("should return a mfa by user", async () => {
      const mockMfa = { id: 1, otp: "1fsf" } as Mfa;

      mockRepository.findOne.mockResolvedValue(mockMfa);

      const response = await postgresAuthRepository.getMfaByUser(
        mockMfa.otp,
        1,
        "login",
        "email",
        false,
        true
      );

      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(response).toEqual(mockMfa);
    });

    it("should return undefined if mfa not found", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const response = await postgresAuthRepository.getMfaByUser(
        "ASd2",
        1,
        "login",
        "email",
        false,
        true
      );

      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(response).toBeNull();
    });
  });

  describe("getSessionByIdOrToken", () => {
    it("should return a session by id or token", async () => {
      const mockSession = { id: 1, accessToken: "1fsf" } as Session;

      mockRepository.findOne.mockResolvedValue(mockSession);

      const response = await postgresAuthRepository.getSessionByIdOrToken(
        1,
        null
      );

      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(response).toEqual(mockSession);
    });

    it("should return a null if session not found", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const response = await postgresAuthRepository.getSessionByIdOrToken(
        null,
        "FDKSOADIOSVJKS3RIRJDS"
      );

      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { accessToken: "FDKSOADIOSVJKS3RIRJDS" },
      });
      expect(response).toBeNull();
    });
  });

  describe("createSession", () => {
    it("should create a session", async () => {
      const mockSession = { id: 1, accessToken: "1fsf" } as Session;

      mockRepository.save.mockResolvedValue(mockSession);

      const response = await postgresAuthRepository.createSession(mockSession);

      expect(response).toEqual(mockSession);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateSession", () => {
    it("should update a session", async () => {
      const mockSession = { id: 1, accessToken: "1fsf" } as Session;
      const resultRaw = [{ ...mockSession }];

      mockRepository.update.mockResolvedValue({
        raw: resultRaw,
      } as any);

      const response = await postgresAuthRepository.updateSession(mockSession);

      expect(response).toEqual(mockSession);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
    });
  });
});
