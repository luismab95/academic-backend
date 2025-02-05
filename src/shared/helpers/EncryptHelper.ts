import { createHash } from "crypto";
import bcrypt from "bcrypt";
import crypto from "crypto";
import colors from "colors";
import fs from "fs";
import path from "path";
import environment from "../infrastructure/Environment";

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

export const generateKeyPairSync = () => {
  try {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        cipher: "aes-256-cbc",
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

export const encryptData = (data: any, publicKey: string): string => {
  const stringData =
    Array.isArray(data) || typeof data === "object"
      ? JSON.stringify(data)
      : data;
  const bufferData = Buffer.from(stringData, "utf8");

  const encrypted = crypto.publicEncrypt(
    { key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
    bufferData
  );
  return encrypted.toString("base64");
};

export const decryptData = (dataEncrypted: string) => {
  const privateKey = fs.readFileSync(
    path.join(process.cwd(), "/keys/privateKey.pem"),
    "utf8"
  );
  const bufferEncryptedData = Buffer.from(dataEncrypted, "base64");

  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      passphrase: environment.CRYPTO_SECRET,
    },
    bufferEncryptedData
  );
  const decryptedData = decrypted.toString("utf8");

  try {
    return JSON.parse(decryptedData);
  } catch (jsonError) {
    return decryptedData;
  }
};
