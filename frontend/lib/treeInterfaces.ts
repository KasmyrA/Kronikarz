import { Parenthood } from "./parenthoodInterfaces";
import { Relationship } from "./relaionshipInterfaces"

export interface Tree {
  id: number;
  uid: number;
  name: string;
  people: number[];
  relationships_details: Relationship[];
  parenthoods: Parenthood[];
}

export interface TreePerson {
  id: number;
  name: string | null;
  surname: string | null;
  sex: "F" | "M" | null;
  imageUrl: string | null;
  birthDate: string;
  deathDate: string;
  position: Position;
}

export interface Position {
  x: number;
  y: number
}