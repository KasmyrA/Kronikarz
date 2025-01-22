export interface Person {
  id: number;
  tree: number;
  names: string[];
  image: number | null; // Index of an image in "files"
  image_details: FileInfo | null;
  description: string;
  sex: "F" | "M" | null;
  birth: EventInLife | null;
  death: EventInLife | null;
  surnames: Surname[];
  jobs: Job[];
  files: number[]; // Additional files of any kind
  files_details: FileInfo[];
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
  id?: number;
  name: string;
  place: string;
  from_date: string;
  untill_date: string;
}

export interface FileInfo {
  id: number;
  file: string;
}
