export type ParenthoodType = "biological" | "adoptive";
export enum ParenthoodKind {
  BIOLOGICAL = "biological",
  ADOPTIVE = "adoptive",
  
};
export interface Parenthood {
  id: number;
  mother: number | null;
  father: number | null;
  child: number;
  type: ParenthoodKind;
  startDate: string | null;
  endDate: string | null;
  adoption: {
    mother: number | null;
    father: number | null;
    date: string | null;
  } | null;
}