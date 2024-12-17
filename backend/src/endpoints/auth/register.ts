import { createUser, getUserByEmail } from "../../db/userQueries.js";
import { Request, Response } from "../../types/helperTypes.js";
import { User } from "../../types/userInterfaces.js";
import { hashPassword } from "../../utils/hashPassword.js";
import { generateAccessToken } from "../../utils/token.js";
import { INT_REG_ERROR, RegisterRequest, RegisterResponse, USR_EXISTS, USRNM_PSW_SPECIFIED } from "./authTypes.js";



export async function register(req: Request<RegisterRequest>, res: Response<RegisterResponse>) {
  const { email, password } = req.body;

  if (email === undefined || password === undefined) {
    res.status(409).json({ error: USRNM_PSW_SPECIFIED });
    return;
  }

  try {
    const user = await getUserByEmail(email);

    if (user) {
      res.status(405).json({ error: USR_EXISTS });
      return;
    }
  } catch (e) {
    console.log(e)
    res.status(400).json({ error: INT_REG_ERROR });
    return;
  }

  const hashedPassword = await hashPassword(password);

  let userId: string
  const newUser: Omit<User, "_id"> = {
    email,
    trees: [],
    hashedPassword
  }

  try {
    userId = await createUser(newUser);
  } catch {
    res.status(400).json({ error: INT_REG_ERROR });
    return;
  }

  const accessToken = generateAccessToken(userId)

  res.status(201).json({ accessToken });
}