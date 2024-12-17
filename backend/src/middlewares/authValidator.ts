import { NextFunction } from "express";
import { ProtectedRequest, Response } from "../types/helperTypes.js";
import { BAD_ACCESS_TOKEN, INT_USR_VALIDATION_ERROR, ProtectedRouteErrorResponse, USR_NOT_EXISTS } from "./middlewareTypes.js";
import { validateAccessToken } from "../utils/token.js";
import { User } from "../types/userInterfaces.js";
import { getUserById } from "../db/userQueries.js";


export async function authValidator(req: ProtectedRequest, res: Response<ProtectedRouteErrorResponse>, next: NextFunction) {
  const { authorization } = req.headers

  if (authorization === undefined || !authorization.startsWith("Bearer")) {
    res.status(401).json({ error: BAD_ACCESS_TOKEN });
    return;
  }

  const accessToken = authorization.slice("Bearer ".length);
  const userId = validateAccessToken(accessToken);

  if (!userId) {
    res.status(401).json({ error: BAD_ACCESS_TOKEN });
    return;
  }

  let user: User | null
  try {
    user = await getUserById(userId);

    if (!user) {
      res.status(405).json({ error: USR_NOT_EXISTS });
      return;
    }
  } catch {
    res.status(400).json({ error: INT_USR_VALIDATION_ERROR });
    return;
  }

  req.user = user;

  return next();
}