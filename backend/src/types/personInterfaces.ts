export interface Person {
  id: number;
  names: string[];
  image: number | null; // Id of an image in "files"
  description: string;
  sex: SexType;
  birth: EventInLife;
  death: EventInLife;
  surnames: Surname[];
  jobs: Job[];
  files: FileInfo[]; // Additional files of any kind
  position: Position;
}

export interface PartialPerson {
  id: number;
  name: string | null;
  surname: string | null;
  sex: SexType;
  imageUrl: string | null;
  birthDate: string;
  deathDate: string;
  position: Position;
}

export type SexType = "F" | "M" | null;

export interface EventInLife {
  date: string;
  place: string;
}

export interface Surname {
  surname: string;
  untill: string;
}

export interface Job {
  name: string;
  place: string;
  from: string;
  untill: string;
}

export interface FileInfo {
  id: number;
  name: string;
  url: string;
}

export interface Position {
  x: number;
  y: number;
}