export interface Parenthood {
  mother: number | null;
  father: number | null;
  child: number;
  adoption: {
    mother: number | null;
    father: number | null;
    date: string | null;
  } | null;
}