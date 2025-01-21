import { authFetch, serverAddress } from "./authActions";
import { FileInfo, Person } from "./personInterfaces";
import { TreePerson } from "./treeInterfaces";

export function personToTreePerson(p: Person): TreePerson {
  return {
    id: p.id,
    name: p.names[0] ?? null,
    surname: p.surnames[0]?.surname ?? null,
    sex: p.sex,
    image: p.files.find(f => f.id === p.image)?.url ?? null,
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

export function addFileToPerson(id: number, file: File): Promise<FileInfo> {
  return new Promise((resolve) => {
    setTimeout(() => {
      toBase64(file)
        .then((fileUrl) => {
          const people: PersonWithPosition[] = JSON.parse(localStorage.getItem('people') ?? "[]");
          const i = people.findIndex(p => p.id === id);
          const newFile: FileInfo = {
            id: getUniqueId(people),
            name: file.name,
            url: fileUrl
          };
          people[i].files.push(newFile);
          localStorage.setItem('people', JSON.stringify(people));
          resolve(newFile);
        });
    }, 1000);
  });
}

export function deleteFileFromPerson(id: number, fileId: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const people: PersonWithPosition[] = JSON.parse(localStorage.getItem('people') ?? "[]");
      const personIndex = people.findIndex(p => p.id === id);
      if (personIndex === -1) return;
      const fileIndex = people[personIndex].files.findIndex(f => f.id === fileId);
      people[personIndex].files.splice(fileIndex, 1);
      if (people[personIndex].image === fileId) {
        people[personIndex].image = null;
      }
      localStorage.setItem('people', JSON.stringify(people));
      resolve();
    }, 1000);
  });
}