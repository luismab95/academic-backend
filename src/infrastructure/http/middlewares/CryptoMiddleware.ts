import { NextFunction, Request, Response } from "express";
import { decryptData, ErrorResponse, validHash } from "../../../shared/helpers";
import environment from "../../../shared/infrastructure/Environment";
import {
  PostgreDeviceRepository,
  PostgresPublicKeyRepository,
} from "../../../infrastructure/persistence/postgres";

export const DecryptDataMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (!environment.ENABLE_CRYPT_E2E) {
      return next();
    }

    const deviceSerie = req.headers["x-device-serie"] as string;
    if (!deviceSerie) {
      return next(
        faliedMiddleware(
          "No se recibio el dispositivo en la cabecera 'x-device-serie'"
        )
      );
    }
    const device = await new PostgreDeviceRepository().findDeviceBySerie(
      deviceSerie
    );
    if (!device) {
      return next(faliedMiddleware("No se encontro el dispositivo"));
    }

    const publicKeyInfo =
      await new PostgresPublicKeyRepository().findByDeviceId(device.id);
    if (
      !publicKeyInfo ||
      !validHash(publicKeyInfo.publicKey, publicKeyInfo.hash)
    ) {
      return next(
        faliedMiddleware("No se encontro información de clave pública")
      );
    }

    req.headers["x-public-key"] = publicKeyInfo.publicKey;

    const { data } = req.body;

    if (data !== undefined) {
      req.body = decryptData(req.body.data);
    }

    return next();
  } catch (error) {
    console.log(error);
    return next(faliedMiddleware("Error al decifrar la información"));
  }
};

const faliedMiddleware = (message: string) =>
  new ErrorResponse(`${message}`, 403);
