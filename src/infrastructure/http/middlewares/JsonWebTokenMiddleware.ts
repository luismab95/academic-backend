import { NextFunction, Request, Response } from "express";
import colors from "colors";
import { ErrorResponse, verifyToken } from "../../../shared/helpers";
import { PostgresAuthRepository } from "../../../infrastructure/persistence/postgres";

export const VerifyTokenMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (token === null) {
    return next(faliedToken(""));
  }

  try {
    verifyToken(token);
    const session = await new PostgresAuthRepository().getSessionByIdOrToken(
      null,
      token
    );

    if (session && !session.isActive) {
      return next(faliedToken(", la sesión ha sido cerrada"));
    }

    return next();
  } catch (err) {
    console.log(colors.red.bold(err));
    return next(faliedToken(""));
  }
};

const faliedToken = (message: string) =>
  new ErrorResponse(`Acceso no autorizado${message}`, 401);
