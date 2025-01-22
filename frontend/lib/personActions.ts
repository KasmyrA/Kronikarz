import { authFetch, serverAddress } from "./authActions";
import { FileInfo, Person } from "./personInterfaces";
import { TreePerson } from "./treeInterfaces";

export function personToTreePerson(p: Person): TreePerson {
  return {
    id: p.id,
    name: p.names[0] ?? null,
    surname: p.surnames[0]?.surname ?? null,
    sex: p.sex,
    image: p.image_details,
    birthDate: p.birth?.date ?? "",
    deathDate: p.death?.date ?? "",
    x: p.x,
    y: p.y
  }
}

export async function createPerson(x: number, y: number, treeId: number): Promise<Person | undefined> {
  const newPerson = {
    tree: treeId,
    x,
    y,
    names: [],
    image: null,
    description: "",
    sex: null,
    birth: { date: "", place: "" },
    death: { date: "", place: "" },
    surnames: [],
    jobs: [],
    files: []
  };
  const headers = new Headers()
  headers.append("Content-Type", "application/json");
  const resp = await authFetch(`${serverAddress}/persons/`, "POST", newPerson, headers);
  return await resp?.json();
}

export async function getPerson(id: number): Promise<Person | undefined> {
  const resp = await authFetch(`${serverAddress}/persons/${id}/`, "GET");
  return await resp?.json();
}

export async function updatePerson(person: Person): Promise<Person | undefined> {
  const headers = new Headers()
  headers.append("Content-Type", "application/json");
  const resp = await authFetch(`${serverAddress}/persons/${person.id}/`, "PUT", person, headers);
  return await resp?.json();
}

export async function deletePerson(id: number) {
  return await authFetch(`${serverAddress}/persons/${id}/`, "DELETE");
}

export async function addFileToPerson(id: number, file: File): Promise<FileInfo | undefined> {
  const person = await getPerson(id);
  if (!person) return undefined;
  const formData = new FormData();
  formData.append('file', file);
  const resp = await authFetch(`${serverAddress}/persons/files/`, 'POST', formData, new Headers(), false);
  const fileInfo: FileInfo | undefined = await resp?.json();
  if (!fileInfo) return undefined;
  person.files.push(fileInfo.id);
  await updatePerson(person);
  return fileInfo
}

export async function deleteFile(fileId: number) {
  return await authFetch(`${serverAddress}/persons/files/${fileId}/`, "DELETE");
}