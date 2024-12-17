import { Router } from "express";
import { authValidator } from "../../middlewares/authValidator.js";
import { createTreeRoute } from "./createTree.js";

const treeRouter = Router();

// Checks 
treeRouter.use(authValidator);

treeRouter.put("/", createTreeRoute);
// treeRouter.get("/", readTree);
// treeRouter.patch("/", updateTree);
// treeRouter.delete("/", deleteTree);

export { treeRouter };