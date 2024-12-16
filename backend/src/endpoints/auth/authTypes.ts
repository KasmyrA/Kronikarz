import { ErrorResponse } from "../../types/helperTypes.js";

// Login
export type LoginRequest = {
  email: string;
  password: string;
};

export const WRONG_EMAIL = 'Wrong email';
export const WRONG_PASSWORD = 'Wrong password';
export const INT_LOGIN_ERROR = 'Internal login error';
export type LoginResponse = ErrorResponse<typeof WRONG_EMAIL | typeof WRONG_PASSWORD | typeof INT_LOGIN_ERROR> | {
  refreshToken: string;
  accessToken: string;
};


// Register
export type RegisterRequest = {
  email: string;
  password: string;
};

export const USRNM_PSW_SPECIFIED = 'email and password must be specified';
export const USR_EXISTS = 'User already exists';
export const INT_REG_ERROR = 'Internal register error';
export type RegisterResponse = ErrorResponse<typeof USRNM_PSW_SPECIFIED | typeof USR_EXISTS | typeof INT_REG_ERROR> | {
  refreshToken: string;
  accessToken: string;
};


// Token
export type TokenLoginRequest = {
  refreshToken: string;
};

export const BAD_REFRESH_TOKEN = 'Bad refresh token';
export const USR_NOT_EXISTS = 'User does not exist';
export const INT_TOKEN_ERROR = 'Internal token error';

export type TokenLoginErrorResponse = ErrorResponse<typeof BAD_REFRESH_TOKEN | typeof USR_NOT_EXISTS | typeof INT_TOKEN_ERROR>
export type TokenLoginResponse = TokenLoginErrorResponse | {
  accessToken: string;
};