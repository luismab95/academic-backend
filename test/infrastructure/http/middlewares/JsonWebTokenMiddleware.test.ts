import { Request, Response, NextFunction } from "express";
import { VerifyTokenMiddleware } from "../../../../src/infrastructure/http/middlewares/JsonWebTokenMiddleware";
import { ErrorResponse, verifyToken } from "../../../../src/shared/helpers";
import { PostgresAuthRepository } from "../../../../src/infrastructure/persistence/postgres";
import {
  decodeToken,
  refreshToken,
} from "../../../../src/shared/helpers/JsonWebTokenHelper";

jest.mock("../../../../src/shared/helpers/JsonWebTokenHelper", () => ({
  decodeToken: jest.fn(),
  refreshToken: jest.fn(),
  verifyToken: jest.fn(),
}));
jest.mock("../../../../src/infrastructure/persistence/postgres/AuthRepository");

describe("JsonWebTokenMiddleware.test", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {};
    next = jest.fn();
  });

  it("should call next with an error if no token is provided", async () => {
    await VerifyTokenMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
  });

  it("should call next with an error if token verification fails", async () => {
    (decodeToken as jest.Mock).mockReturnValue({ exp: Date.now() + 1000 });
    (verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    req.headers!.authorization = "Bearer invalidtoken";

    await VerifyTokenMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
  });

  it("should call next with an error if session is inactive", async () => {
    (decodeToken as jest.Mock).mockReturnValue({ exp: Date.now() + 1000 });
    (verifyToken as jest.Mock).mockReturnValue(true);
    (
      PostgresAuthRepository.prototype.getSessionByIdOrToken as jest.Mock
    ).mockResolvedValue({
      isActive: false,
    });

    req.headers!.authorization = "Bearer validtoken";

    await VerifyTokenMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
  });

  it("should call next without error if token is valid and session is active", async () => {
    (decodeToken as jest.Mock).mockReturnValue({ exp: Date.now() + 1000 });
    (verifyToken as jest.Mock).mockReturnValue(true);
    (
      PostgresAuthRepository.prototype.getSessionByIdOrToken as jest.Mock
    ).mockResolvedValue({
      isActive: true,
    });

    req.headers!.authorization = "Bearer validtoken";

    await VerifyTokenMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should call next without error if token is expired and session is active and refresh token work", async () => {
    (refreshToken as jest.Mock).mockReturnValue("newtoken");
    (decodeToken as jest.Mock).mockReturnValue({ exp: Date.now() - 1000 });
    (verifyToken as jest.Mock).mockReturnValue(true);
    (
      PostgresAuthRepository.prototype.getSessionByIdOrToken as jest.Mock
    ).mockResolvedValue({
      isActive: true,
    });

    req.headers!.authorization = "Bearer validtoken";

    await VerifyTokenMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should call next with error if token is expired and session is active and refresh token is expired", async () => {
    (refreshToken as jest.Mock).mockRejectedValue(
      new ErrorResponse("Refresh token expired", 401)
    );
    (decodeToken as jest.Mock).mockReturnValue({ exp: 1516239022 });
    (verifyToken as jest.Mock).mockReturnValue(true);
    (
      PostgresAuthRepository.prototype.getSessionByIdOrToken as jest.Mock
    ).mockResolvedValue({
      isActive: true,
    });

    req.headers!.authorization = "Bearer validtoken";

    await VerifyTokenMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
  });
});
