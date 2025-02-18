import crypto, { createHash } from "crypto";
import bcrypt from "bcrypt";
import colors from "colors";
import fs from "fs";
import path from "path";
import environment from "../infrastructure/Environment";

export interface EncryptedData {
  encryptedAESKey: string;
  encryptedMessage: string;
  iv: string;
}

export const encryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateSHA256Hash = (text: string) => {
  return createHash("sha256").update(text).digest("hex");
};

export const validHash = (text: string, hash: string) => {
  const newHash = generateSHA256Hash(text);
  return newHash === hash;
};

export const generateKeyPair = () => {
  try {
    const privateKeyPath = path.join(process.cwd(), "/keys/privateKey.pem");
    const publicKeyPath = path.join(process.cwd(), "/keys/publicKey.pem");

    if (fs.existsSync(privateKeyPath)) fs.unlinkSync(privateKeyPath);
    if (fs.existsSync(publicKeyPath)) fs.unlinkSync(publicKeyPath);

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        cipher: "AES-256-CBC",
        passphrase: environment.CRYPTO_SECRET,
      },
    });

    fs.writeFileSync(
      `${path.join(process.cwd(), "/keys/privateKey.pem")}`,
      privateKey
    );
    fs.writeFileSync(
      `${path.join(process.cwd(), "/keys/publicKey.pem")}`,
      publicKey
    );

    console.log(colors.green.bold("Keys generated successfully!"));
  } catch (error) {
    console.error(colors.red.bold(`Error generating keys: ${error}`));
  }
};

export const generateAESKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const encryptAES = (
  text: string,
  key: string
): { encrypted: string; iv: string } => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "AES-256-GCM",
    Buffer.from(key, "hex"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return { encrypted, iv: iv.toString("hex") };
};

export const decryptAES = (encryptedText: string, key: string, iv: string) => {
  const keyBuffer = Buffer.from(key, "hex");
  const ivBuffer = Buffer.from(iv, "hex");

  const decipher = crypto.createDecipheriv("AES-256-GCM", keyBuffer, ivBuffer);
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export const encryptAESKeyWithRSA = (
  aesKey: string,
  publicKey: string
): string => {
  return crypto
    .publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      Buffer.from(aesKey, "utf-8")
    )
    .toString("base64");
};

export const decryptAESKeyWithRSA = (
  encryptedAESKey: string,
  serverPrivateKey: string
) => {
  return crypto
    .privateDecrypt(
      {
        key: serverPrivateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        passphrase: environment.CRYPTO_SECRET,
      },
      Buffer.from(encryptedAESKey, "base64")
    )
    .toString("utf-8");
};

export const encryptedData = (data: any, publicKey: string) => {
  try {
    const stringData =
      Array.isArray(data) || typeof data === "object"
        ? JSON.stringify(data)
        : data;

    const aesKey = generateAESKey();

    const { encrypted, iv } = encryptAES(stringData, aesKey);

    const encryptedAESKey = encryptAESKeyWithRSA(aesKey, publicKey);

    return {
      encryptedAESKey,
      encryptedMessage: encrypted,
      iv,
    } as EncryptedData;
  } catch (error) {
    throw new Error("Error encrypting data");
  }
};

export const decryptedData = (payload: EncryptedData) => {
  try {
    const { encryptedAESKey, encryptedMessage, iv } = payload;

    const privateKey = fs.readFileSync(
      path.join(process.cwd(), "/keys/privateKey.pem"),
      "utf8"
    );

    const aesKey = decryptAESKeyWithRSA(encryptedAESKey, privateKey);

    const decryptedMessage = decryptAES(encryptedMessage, aesKey, iv);

    try {
      return JSON.parse(decryptedMessage);
    } catch (jsonError) {
      return decryptedData;
    }
  } catch (error) {
    throw new Error("Error decrypting data");
  }
};
