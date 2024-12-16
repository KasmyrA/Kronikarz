import { ObjectId } from "mongodb";
import { getUserById } from "../../db/userQueries.js";
import { Request, Response } from "../../types/helperTypes.js";
import { User } from "../../types/userInterfaces.js";
import { generateAccessToken, validateRefreshToken } from "../../utils/token.js";
import { BAD_REFRESH_TOKEN, INT_TOKEN_ERROR, TokenLoginRequest, TokenLoginResponse, USR_NOT_EXISTS } from "./authTypes.js";

export async function token(req: Request<TokenLoginRequest>, res: Response<TokenLoginResponse>) {
  const { refreshToken } = req.body;

  const payload = validateRefreshToken(refreshToken);

  if (!(typeof payload === "object" && "_id" in payload && typeof payload._id === "string")) {
    res.status(401).json({ error: BAD_REFRESH_TOKEN });
    return;
  }

  let user: User | null
  try {
    user = await getUserById(new ObjectId(payload._id));

    if (!user) {
      res.status(405).json({ error: USR_NOT_EXISTS });
      return;
    }
  } catch {
    res.status(400).json({ error: INT_TOKEN_ERROR });
    return;
  }

  const accessToken = generateAccessToken(user._id);

  res.status(200).json({ accessToken });
}