export type ParenthoodType = "biological" | "adoptive";
export interface Parenthood {
  mother: number | null;
  father: number | null;
  child: number;
  type: ParenthoodType
  startDate: string | null;
  endDate: string | null;
  adoption: {
    mother: number | null;
    father: number | null;
    date: string | null;
  } | null;
}