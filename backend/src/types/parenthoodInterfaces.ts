export interface Parenthood {
  mother: number;
  father: number;
  child: number;
  adoption: {
    mother: number | null;
    father: number | null;
    date: string | null;
  } | null;
}