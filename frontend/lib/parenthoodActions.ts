import { authFetch, serverAddress } from "./authActions";
import { Parenthood } from "./parenthoodInterfaces";


export async function createParenthood(parenthood: Omit<Parenthood, "id">, treeId: number): Promise<Parenthood | undefined> {
  const headers = new Headers()
  headers.append("Content-Type", "application/json");
  const resp = await authFetch(`${serverAddress}/parenthoods/`, "POST", { ...parenthood, tree: treeId }, headers);
  return await resp?.json();
}

export async function getParenthood(parenthoodId: number): Promise<Parenthood | undefined> {
  const resp = await authFetch(`${serverAddress}/parenthoods/${parenthoodId}/`, "GET");
  return await resp?.json();
}

export async function updateParenthood(parenthood: Parenthood): Promise<Parenthood | undefined> {
  const headers = new Headers()
  headers.append("Content-Type", "application/json");
  const resp = await authFetch(`${serverAddress}/parenthoods/${parenthood.id}/`, "PUT", parenthood, headers);
  return await resp?.json();
}

export async function deleteParenthood(parenthoodId: number) {
  return await authFetch(`${serverAddress}/parenthoods/${parenthoodId}/`, "DELETE");
}