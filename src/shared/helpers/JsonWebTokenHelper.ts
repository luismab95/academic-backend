import jwt, { JwtPayload } from "jsonwebtoken";
import environment from "../infrastructure/Environment";
import { PostgresAuthRepository } from "../../infrastructure/persistence/postgres";
import { ErrorResponse } from "./ResponseHelper";

export const verifyToken = (token: string): JwtPayload | string => {
  return jwt.verify(token, environment.JWT_SECRET);
};

export const decodeToken = (token: string): JwtPayload | string => {
  return jwt.decode(token);
};

export const generateToken = (payload: JwtPayload, expiresIn: any): string => {
  return jwt.sign(payload, environment.JWT_SECRET, {
    expiresIn,
  });
};

export const refreshToken = async (sessionId: number) => {
  const session = await new PostgresAuthRepository().getSessionByIdOrToken(
    sessionId,
    null
  );
  if (!session) {
    throw new ErrorResponse("Sesión no encontrada", 401);
  }

  const payloadRefreshToken = decodeToken(session.refreshToken) as JwtPayload;
  if (payloadRefreshToken.exp && Date.now() >= payloadRefreshToken.exp * 1000) {
    session.isActive = false;
    await new PostgresAuthRepository().updateSession(session);
    throw new ErrorResponse("El token de refresco ha expirado", 401);
  }

  const newToken = generateToken(
    {
      sessionId: session.id,
      userId: payloadRefreshToken.userId,
      email: payloadRefreshToken.email,
      fullname: payloadRefreshToken.fullname,
    },
    "1h"
  );
  session.accessToken = newToken;
  await new PostgresAuthRepository().updateSession(session);

  return newToken;
};
