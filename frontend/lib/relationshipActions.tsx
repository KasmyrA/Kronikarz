import { authFetch, serverAddress } from "./authActions";
import { Relationship } from "./relaionshipInterfaces";

export async function createRelationship(relationship: Omit<Relationship, "id">, treeId: number): Promise<Relationship | undefined> {
  const headers = new Headers()
  headers.append("Content-Type", "application/json");
  const resp = await authFetch(`${serverAddress}/relationships/`, "POST", { ...relationship, tree: treeId }, headers);
  return await resp?.json();
}

export async function getRelationship(relationshipId: number): Promise<Relationship | undefined> {
  const resp = await authFetch(`${serverAddress}/relationships/${relationshipId}/`, "GET");
  return await resp?.json();
}

export async function updateRelationship(relationship: Relationship): Promise<Relationship | undefined> {
  const headers = new Headers()
  headers.append("Content-Type", "application/json");
  const resp = await authFetch(`${serverAddress}/relationships/${relationship.id}/`, "PUT", relationship, headers);
  return await resp?.json();
}

export async function deleteRelationship(relationshipId: number) {
  return await authFetch(`${serverAddress}/relationships/${relationshipId}/`, "DELETE");
}
