import { getUserByEmail } from "../../db/userQueries.js";
import { Request, Response } from "../../types/helperTypes.js";
import { User } from "../../types/userInterfaces.js";
import { comparePasswords } from "../../utils/hashPassword.js";
import { generateAccessToken } from "../../utils/token.js";
import { INT_LOGIN_ERROR, LoginRequest, LoginResponse, WRONG_EMAIL, WRONG_PASSWORD } from "./authTypes.js";


export async function login(req: Request<LoginRequest>, res: Response<LoginResponse>) {
  const { email, password } = req.body;

  let user: User | null
  try {
    user = await getUserByEmail(email);

    if (!user) {
      res.status(402).json({ error: WRONG_EMAIL });
      return;
    }
  } catch {
    res.status(400).json({ error: INT_LOGIN_ERROR });
    return;
  }

  const isPasswordCorrect = await comparePasswords(password, user.hashedPassword);
  if (!isPasswordCorrect) {
    res.status(401).json({ error: WRONG_PASSWORD });
    return;
  }

  const accessToken = generateAccessToken(user._id)

  res.status(200).json({ accessToken });
}