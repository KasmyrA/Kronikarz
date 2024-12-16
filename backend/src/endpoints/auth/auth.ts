import { Router } from "express";
import { register } from "./register.js";
import { login } from "./login.js";
import { token } from "./token.js";

const authRouter = Router();

authRouter.put("/register", register);
authRouter.post("/login", login);
authRouter.post("/token", token)

export { authRouter };