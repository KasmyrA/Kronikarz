import { Router } from "express";
import { register } from "./register.js";
import { login } from "./login.js";

const authRouter = Router();

authRouter.put("/register", register);
authRouter.post("/login", login);

export { authRouter };