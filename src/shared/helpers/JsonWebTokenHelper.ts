import jwt, { JwtPayload } from "jsonwebtoken";
import environment from "../infrastructure/Environment";

export const verifyToken = (token: string): JwtPayload | string => {  
  return jwt.verify(token, environment.JWT_SECRET);
};

export const generateToken = (payload: JwtPayload, expiresIn: any): string => {
  return jwt.sign(payload, environment.JWT_SECRET, {
    expiresIn,
  });
};
