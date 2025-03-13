import { genSalt, hash, compare } from "bcryptjs";

export const textToHash = async (planeText: string) => {
  const SALT = await genSalt(10);
  return await hash(planeText, SALT);
};

export const decrypt = async (text: string, hash: string) => {
  return await compare(text, hash);
};
