import crypto from "crypto";

export const generateRandomString = (length: number) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(array[i] % characters.length);
  }
  return result;
};
