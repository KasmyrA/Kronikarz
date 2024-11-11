export interface Person {
  id: number;
  names: string[];
  image: number | null; // Index of an image in "files"
  description: string;
  sex: "F" | "M" | null;
  birth: EventInLife;
  death: EventInLife;
  surnames: Surname[];
  jobs: Job[];
  files: FileInfo[]; // Additional files of any kind
}

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