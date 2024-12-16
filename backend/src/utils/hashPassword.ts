import { hash } from "bcrypt";
export { compare as comparePasswords } from "bcrypt";

const SALT_ROUNDS = 10;

export function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}