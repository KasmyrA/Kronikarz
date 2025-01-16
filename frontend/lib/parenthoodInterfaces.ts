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
}