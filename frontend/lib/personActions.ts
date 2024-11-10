import { Person } from "./personInterfaces";
import { Position, TreePerson } from "./treeInterfaces";

interface PersonWithPosition extends Person {
  position: Position
}

export function createPerson(position: Position): Promise<TreePerson> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const people: PersonWithPosition[] = JSON.parse(localStorage.getItem('people') ?? "[]");
      const newPerson: PersonWithPosition = {
        id: people.length,
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

export function updatePerson(person: Person): Promise<void> {
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
      delete people[i];
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