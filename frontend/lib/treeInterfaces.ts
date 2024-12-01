import { Parenthood } from "./parenthoodInterfaces";
import { RelationshipKind } from "./relaionshipInterfaces"

export interface Tree {
  id: number;
  name: string;
  people: TreePerson[];
  relationships: TreeRelationship[];
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

export interface TreeRelationship {
  id: number;
  parrner1: number;
  partner2: number;
  kind: RelationshipKind;
}