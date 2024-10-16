import { Person } from "./personInterfaces";
import { Position, TreePerson } from "./treeInterfaces";

interface PersonWithPosition extends Person {
  position: Position
}

export async function createPerson(position: Position): Promise<TreePerson> {
  const people: PersonWithPosition[] =  JSON.parse(localStorage.getItem('people') ?? "[]");
  const newPerson: PersonWithPosition = {
    id: people.length,
    names: [],
    image: null,
    description: "",
    sex: null,
    birth: null,
    death:  null,
    surnames: [],
    jobs: [],
    files: [],
    position
  };
  people.push(newPerson)
  localStorage.setItem('people', JSON.stringify(people));
  return personToTreePerson(newPerson);
}

export async function getPerson(id: number): Promise<Person | undefined> {
  const people: Person[] =  JSON.parse(localStorage.getItem('people') ?? "[]");
  return people.find(p => p.id === id);
}

export async function updatePerson(person: Person): Promise<void> {
  const people: PersonWithPosition[] =  JSON.parse(localStorage.getItem('people') ?? "[]");
  const i = people.findIndex(p => p.id === person.id);
  people[i] = {
    ...people[i],
    ...person
  }
  localStorage.setItem('people', JSON.stringify(people));
}

export async function updatePersonPosition(id: number, position: Position): Promise<void> {
  const people: PersonWithPosition[] =  JSON.parse(localStorage.getItem('people') ?? "[]");
  const i = people.findIndex(p => p.id === id);
  people[i].position = position;
  localStorage.setItem('people', JSON.stringify(people));
}

export async function deletePerson(id: number): Promise<void> {
  const people: PersonWithPosition[] =  JSON.parse(localStorage.getItem('people') ?? "[]");
  const i = people.findIndex(p => p.id === id);
  delete people[i];
  localStorage.setItem('people', JSON.stringify(people));
}

// Remove after adding API integration
export function personToTreePerson(p: PersonWithPosition): TreePerson {
  return {
    id: p.id,
    name: p.names[0] ?? null,
    surname: p.surnames.at(-1)?.surname ?? null,
    imageUrl: p.files[p.image ?? -1]?.url ?? null,
    birthDate: p.birth?.day ?? null,
    deathDate: p.death?.day ?? null,
    position: p.position
  }
}