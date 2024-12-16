import { Parenthood } from "./parenthoodInterfaces.js";
import { PartialPerson, Person } from "./personInterfaces.js";
import { Relationship } from "./relaionshipInterfaces.js";

export interface Tree {
  id: number;
  name: string;
  people: Person[];
  relationships: Relationship[];
  parenthoods: Parenthood[];
}

export interface PartialTree {
  id: number;
  name: string;
  people: PartialPerson[];
  relationships: Relationship[];
  parenthoods: Parenthood[];
}




