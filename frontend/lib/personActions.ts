import { FileInfo, Person } from "./personInterfaces";
import { Position, TreePerson } from "./treeInterfaces";

interface PersonWithPosition extends Person {
  position: Position
}

function getUniqueId<T extends { id: number }>(arr: T[]) {
  let id: number;
  do {
    id = Math.round(Math.random() * 1000000);
  } while (arr.some(t => t.id === id));
  return id;
}

export function createPerson(position: Position): Promise<TreePerson> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const people: PersonWithPosition[] = JSON.parse(localStorage.getItem('people') ?? "[]");
      const newPerson: PersonWithPosition = {
        id: getUniqueId(people),
        names: [],
        image: null,
        description: "",
        sex: null,
        birth: { date: "", place: "" },
        death: { date: "", place: "" },
        surnames: [],
        jobs: [],
        files: [],
        position
      };
      people.push(newPerson)
      localStorage.setItem('people', JSON.stringify(people));
      resolve(personToTreePerson(newPerson));
    }, 1000);
  });
}

export function getPerson(id: number): Promise<Person | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const people: PersonWithPosition[] = JSON.parse(localStorage.getItem('people') ?? "[]");
      resolve(people.find(p => p.id === id));
    }, 1000);
  });
}

export function getTreePerson(id: number): Promise<TreePerson | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const people: PersonWithPosition[] = JSON.parse(localStorage.getItem('people') ?? "[]");
      const person = people.find(p => p.id === id);
      resolve(person && personToTreePerson(person));
    }, 1000);
  });
}

export function updatePerson(person: Omit<Person, "files">): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const people: PersonWithPosition[] = JSON.parse(localStorage.getItem('people') ?? "[]");
      const i = people.findIndex(p => p.id === person.id);
      people[i] = {
        ...people[i],
        ...person
      }
      localStorage.setItem('people', JSON.stringify(people));
      resolve();
    }, 1000);
  });
}

export function updatePersonPosition(id: number, position: Position): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const people: PersonWithPosition[] = JSON.parse(localStorage.getItem('people') ?? "[]");
      const i = people.findIndex(p => p.id === id);
      people[i].position = position;
      localStorage.setItem('people', JSON.stringify(people));
      resolve();
    }, 1000);
  });
}

export function deletePerson(id: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const people: PersonWithPosition[] = JSON.parse(localStorage.getItem('people') ?? "[]");
      const i = people.findIndex(p => p.id === id);
      people.splice(i, 1);
      localStorage.setItem('people', JSON.stringify(people));
      resolve();
    }, 1000);
  });
}

// Remove after adding API integration
export function personToTreePerson(p: PersonWithPosition): TreePerson {
  return {
    id: p.id,
    name: p.names[0] ?? null,
    surname: p.surnames[0]?.surname ?? null,
    sex: p.sex,
    imageUrl: p.files[p.image ?? -1]?.url ?? null,
    birthDate: p.birth.date,
    deathDate: p.death.date,
    position: p.position
  }
}

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = reject;
});

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
      const fileIndex = people[personIndex]?.files.findIndex(f => f.id === fileId);
      people[personIndex]?.files.splice(fileIndex, 1);
      localStorage.setItem('people', JSON.stringify(people));
      resolve();
    }, 1000);
  });
}