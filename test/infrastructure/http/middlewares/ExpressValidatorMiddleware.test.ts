import { Request, Response, NextFunction } from "express";
import { ValidationChain, body } from "express-validator";
import { ErrorResponse } from "../../../../src/shared/helpers";
import { ValidationMiddleware } from "../../../../src/infrastructure/http/middlewares/ExpressValidatorMiddleware";

describe("ExpressValidatorMiddleware", () => {
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

  it("should return next with Error if request body is invalid", async () => {
    const validations: ValidationChain[] = [body("name").isString().notEmpty()];
    req.body = {};
    await ValidationMiddleware(validations)(
      req as Request,
      res as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
  });

  it("should return next without Error", async () => {
    const validations: ValidationChain[] = [body("name").isString().notEmpty()];
    req.body = { name: "test" };
    await ValidationMiddleware(validations)(
      req as Request,
      res as Response,
      next
    );

    expect(next).toHaveBeenCalledWith();
  });
});
