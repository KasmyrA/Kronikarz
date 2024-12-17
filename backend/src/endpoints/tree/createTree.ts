import { createTree } from "../../db/treeQueries.js";
import { ProtectedRequest, Response } from "../../types/helperTypes.js";
import { CreateTreeRequest, CreateTreeResponse, INT_CREATE_TREE_ERROR, TREE_NAME_REQUIRED } from "./treeTypes.js";

export async function createTreeRoute(req: ProtectedRequest<CreateTreeRequest>, res: Response<CreateTreeResponse>) {
  const { user } = req;
  const { treeName } = req.body

  if (!treeName) {
    res.status(401).json({ error: TREE_NAME_REQUIRED });
    return;
  }

  try {
    const treeId = await createTree(treeName, user._id);
    res.status(201).json({ _id: treeId });
  } catch {
    res.status(400).json({ error: INT_CREATE_TREE_ERROR });
  }
}