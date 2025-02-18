import { Request, Response, NextFunction } from "express";
import { DecryptDataMiddleware } from "../../../../src/infrastructure/http/middlewares/CryptoMiddleware";
import {
  ErrorResponse,
  validHash,
  decryptedData,
} from "../../../../src/shared/helpers";
import {
  PostgreDeviceRepository,
  PostgresPublicKeyRepository,
} from "../../../../src/infrastructure/persistence/postgres";
import environment from "../../../../src/shared/infrastructure/Environment";

jest.mock(
  "../../../../src/infrastructure/persistence/postgres/DeviceRepository"
);
jest.mock(
  "../../../../src/infrastructure/persistence/postgres/PublicKeyRepository"
);
jest.mock("../../../../src/shared/helpers/EncryptHelper");
jest.mock("../../../../src/shared/infrastructure/Environment");

describe("CryptoMiddleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
      body: {},
    };
    res = {};
    next = jest.fn();
  });

  it("should call next if ENABLE_CRYPT_E2E is false", async () => {
    (environment as any).ENABLE_CRYPT_E2E = false;
    await DecryptDataMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should return an error if 'x-device-serie' header is missing", async () => {
    (environment as any).ENABLE_CRYPT_E2E = true;

    await DecryptDataMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      new ErrorResponse(
        "No se recibio el dispositivo en la cabecera 'x-device-serie'",
        403
      )
    );
  });

  it("should return an error if device is not found", async () => {
    (environment as any).ENABLE_CRYPT_E2E = true;
    req.headers!["x-device-serie"] = "test-serie";
    (
      PostgreDeviceRepository.prototype.findDeviceBySerie as jest.Mock
    ).mockResolvedValue(null);

    await DecryptDataMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      new ErrorResponse("No se encontro el dispositivo", 403)
    );
  });

  it("should return an error if public key info is not found or invalid", async () => {
    (environment as any).ENABLE_CRYPT_E2E = true;
    req.headers!["x-device-serie"] = "test-serie";
    (
      PostgreDeviceRepository.prototype.findDeviceBySerie as jest.Mock
    ).mockResolvedValue({ id: 1 });
    (
      PostgresPublicKeyRepository.prototype.findByDeviceId as jest.Mock
    ).mockResolvedValue(null);

    await DecryptDataMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      new ErrorResponse("No se encontro información de clave pública", 403)
    );
  });

  it("should decrypt data if present", async () => {
    (environment as any).ENABLE_CRYPT_E2E = true;
    req.headers!["x-device-serie"] = "test-serie";
    req.body = { data: "encryptedData" };
    (
      PostgreDeviceRepository.prototype.findDeviceBySerie as jest.Mock
    ).mockResolvedValue({ id: 1 });
    (
      PostgresPublicKeyRepository.prototype.findByDeviceId as jest.Mock
    ).mockResolvedValue({
      publicKey: "publicKey",
      hash: "validHash",
    });
    (validHash as jest.Mock).mockReturnValue(true);
    (decryptedData as jest.Mock).mockReturnValue({ decrypted: "data" });

    await DecryptDataMiddleware(req as Request, res as Response, next);

    expect(req.headers!["x-public-key"]).toBe("publicKey");
    expect(req.body).toEqual({ decrypted: "data" });
    expect(next).toHaveBeenCalled();
  });

  it("should call next with error if decryption fails", async () => {
    (environment as any).ENABLE_CRYPT_E2E = true;
    req.headers!["x-device-serie"] = "test-serie";
    req.body = { data: "encryptedData" };
    (
      PostgreDeviceRepository.prototype.findDeviceBySerie as jest.Mock
    ).mockResolvedValue({ id: 1 });
    (
      PostgresPublicKeyRepository.prototype.findByDeviceId as jest.Mock
    ).mockResolvedValue({
      publicKey: "publicKey",
      hash: "validHash",
    });
    (validHash as jest.Mock).mockReturnValue(true);
    (decryptedData as jest.Mock).mockImplementation(() => {
      throw new Error("Decryption error");
    });

    await DecryptDataMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      new ErrorResponse("Error al decifrar la información", 403)
    );
  });
});
