export interface Person {
  id: number;
  tree: number;
  names: string[];
  image: number | null; // Index of an image in "files"
  description: string;
  sex: "F" | "M" | null;
  birth: EventInLife | null;
  death: EventInLife | null;
  surnames: Surname[];
  jobs: Job[];
  files: FileInfo[]; // Additional files of any kind
  x: number;
  y: number;
}

export interface EventInLife {
  date: string;
  place: string;
}

export interface Surname {
  surname: string;
  untill: string | null;
}

export interface Job {
  id: number;
  name: string;
  place: string;
  from_date: string;
  untill_date: string;
}

export interface FileInfo {
  id: number;
  name: string;
  url: string;
}
