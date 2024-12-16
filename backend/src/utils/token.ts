import jwt from 'jsonwebtoken';
import { IdType } from "../db/db.js";

export function generateAccessToken(_id: IdType) {
  const accessToken = jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
  return accessToken
}

function validateToken(token: string, secret: string) {
  try {
    return jwt.verify(token, secret);
  } catch {
    return undefined;
  }
}

export function validateAccessToken(token: string) {
  return validateToken(token, process.env.ACCESS_TOKEN_SECRET)
}