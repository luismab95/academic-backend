import { Request, Response, NextFunction } from "express";
import { ValidationChain, validationResult } from "express-validator";
import { ErrorResponse } from "../../../shared/helpers";

export const ValidationMiddleware = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      const error = new ErrorResponse(errorMessages.join(", "), 422);
      return next(error);
    }

    return next();
  };
};
