import { NextFunction, Request, Response } from "express";
import { encryptData } from "./EncryptHelper";
import colors from "colors";

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
  const encryptedData = encryptData(
    data,
    req.headers["x-public-key"] as string
  );
  res.json({ status: true, data: encryptedData });
};

export const errorHandler = (
  error: any,
  _req: Request,
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
