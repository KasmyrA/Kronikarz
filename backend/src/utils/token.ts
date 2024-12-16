import jwt from 'jsonwebtoken';
import { IdType } from "../db/db.js";

export function generateTokens(_id: IdType) {
  const accessToken = jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y' });
  return { accessToken, refreshToken }
}

export function generateAccessToken(_id: IdType) {
  const accessToken = jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  return accessToken
}

function validateToken(token: string, secret: string) {
  try {
    return jwt.verify(token, secret);
  } catch {
    return undefined;
  }
}

export function validateRefreshToken(token: string) {
  return validateToken(token, process.env.REFRESH_TOKEN_SECRET)
}

export function validateAccessToken(token: string) {
  return validateToken(token, process.env.ACCESS_TOKEN_SECRET)
}