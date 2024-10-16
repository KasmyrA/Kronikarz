export interface Person {
  id: number;
  names: string[];
  image: number | null; // Index of an image in "files"
  description: string;
  sex: "F" | "M";
  birth: EventInLife;
  death: EventInLife | null;
  surnames: Surname[];
  jobs: Job[];
  files: FileInfo[]; // Additional files of any kind
}

export interface EventInLife {
  day: string | null;
  place: string | null;
}

export interface Surname {
  surname: string;
  untill: string | null;
}

export interface Job {
  name: string;
  place: string | null;
  from: string | null;
  untill: string | null;
}

export interface FileInfo {
  name: string;
  url: string;
}