import { NextFunction, Request, Response } from "express";
import environment from "../infrastructure/Environment";
import colors from "colors";
import { encryptedData } from "./EncryptHelper";

export class ErrorResponse extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const responseHelper = (req: Request, res: Response, data: unknown) => {
  if (environment.ENABLE_CRYPT_E2E) {
    const publicKey = req.headers["x-public-key"] as string;

    if (!publicKey) {
      res.json({ status: true, data });
      return;
    }
    const encrypted = encryptedData(data, publicKey);
    
    res.json({ status: true, data: encrypted });
    return;
  }
  res.json({ status: true, data });
};

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(colors.red.bold(error.stack));

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  res.status(statusCode).json({
    status: false,
    message: message,
  });
};
