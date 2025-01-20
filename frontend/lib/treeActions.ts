import { authFetch, getCurrentUserId, serverAddress } from "./authActions";
import { Tree } from "./treeInterfaces";

export async function getTreeList() {
  const resp = await authFetch(`${serverAddress}/trees/`, "GET");
  const trees: Tree[] | null = await resp?.json();
  const userId = getCurrentUserId();
  return trees?.filter((t) => t.uid === userId);
}

export async function addTree(treeName: string): Promise<Tree | undefined> {
  const headers = new Headers()
  headers.append("Content-Type", "application/json");
  const userId = getCurrentUserId();
  const resp = await authFetch(`${serverAddress}/trees/`, "POST", { uid: userId, name: treeName }, headers);
  return await resp?.json();
}

export async function deleteTree(treeId: number) {
  return await authFetch(`${serverAddress}/trees/${treeId}/`, "DELETE");
}

export async function getTree(id: number): Promise<Tree | undefined> {
  const resp = await authFetch(`${serverAddress}/trees/${id}/`, "GET");
  return await resp?.json();
}