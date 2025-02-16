import { NextFunction, Request, Response } from "express";
import colors from "colors";
import {
  decodeToken,
  ErrorResponse,
  refreshToken,
  verifyToken,
} from "../../../shared/helpers";
import { PostgresAuthRepository } from "../../../infrastructure/persistence/postgres";
import { JwtPayload } from "jsonwebtoken";

export const VerifyTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  let token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (token === null) {
    return next(faliedToken(""));
  }

  try {
    const payload = decodeToken(token) as JwtPayload;

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      token = await refreshToken(payload.sessionId);
      console.log(token);

      res.setHeader("REFRESH_TOKEN", token);
    }

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
