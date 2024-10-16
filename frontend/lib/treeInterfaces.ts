import { Parenthood } from "./parenthoodInterfaces";
import { RelationshipKind } from "./relaionshipInterfaces"

export interface Tree {
  id: number;
  name: string;
  people: TreePerson[];
  relationships: TreeRelationship[];
  parenthood: Parenthood[];
}

export interface TreePerson {
  id: number;
  name: string | null;
  surname: string | null;
  imageUrl: string | null;
  birthDate: string | null;
  deathDate: string | null;
  position: {
    x: number;
    y: number;
  };
}

export interface TreeRelationship {
  id: number;
  parrner1: number;
  partner2: number;
  kind: RelationshipKind;
}