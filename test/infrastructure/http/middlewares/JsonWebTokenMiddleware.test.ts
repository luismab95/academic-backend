import { Request, Response, NextFunction } from "express";
import { VerifyTokenMiddleware } from "../../../../src/infrastructure/http/middlewares/JsonWebTokenMiddleware";
import { ErrorResponse, verifyToken } from "../../../../src/shared/helpers";
import { PostgresAuthRepository } from "../../../../src/infrastructure/persistence/postgres";

jest.mock("../../../../src/shared/helpers/JsonWebTokenHelper");
jest.mock(
  "../../../../src/infrastructure/persistence/postgres/AuthRepository"
);

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
    (verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    req.headers!.authorization = "Bearer invalidtoken";

    await VerifyTokenMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
  });

  it("should call next with an error if session is inactive", async () => {
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
});
