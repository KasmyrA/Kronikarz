import { ErrorResponse } from "../types/helperTypes.js";

export const BAD_ACCESS_TOKEN = 'Bad access token';
export const INT_USR_VALIDATION_ERROR = 'Internal user validation error';
export const USR_NOT_EXISTS = 'User does not exist';
export type ProtectedRouteErrorResponse = ErrorResponse<typeof BAD_ACCESS_TOKEN | typeof USR_NOT_EXISTS | typeof INT_USR_VALIDATION_ERROR>