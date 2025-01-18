export enum ParenthoodKind {
  BIOLOGICAL = "biological",
  ADOPTIVE = "adoptive",
};

export interface Parenthood {
  id: number;
  mother: number;
  father: number;
  child: number;
  type: ParenthoodKind;
}