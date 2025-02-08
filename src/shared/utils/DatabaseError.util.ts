import { ErrorResponse } from "../helpers";

export const errorDatabase = (errorDetail: string, defaultError: string) => {
  switch (true) {
    case errorDetail.includes("email"):
      throw new ErrorResponse("Correo Electrónico ya existe", 409);
    case errorDetail.includes("identification"):
      throw new ErrorResponse("Cédula ya existe.", 409);
    case errorDetail.includes("phone"):
      throw new ErrorResponse("Teléfono ya existe.", 409);
    case errorDetail.includes("hash"):
      throw new ErrorResponse("Hash ya existe", 409);
    case errorDetail.includes("publicKey"):
      throw new ErrorResponse("Clave pública ya existe.", 409);
  }

  throw new ErrorResponse(defaultError, 400);
};
