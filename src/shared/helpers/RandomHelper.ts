import crypto from "crypto";

export const generateRandomString = (length: number) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(array[i] % characters.length);
  }
  return result;
};

export const generateRandomNumber = (min: number = 1, max: number = 101) => {
  const randomNumber = crypto.randomInt(min, max);
  return randomNumber;
};
