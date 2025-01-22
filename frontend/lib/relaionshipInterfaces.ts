export interface Relationship {
  id: number;
  partner1: number;
  partner2: number;
  kind: RelationshipKind;
  from_date: string | null;
  untill_date: string | null;
}

export enum RelationshipKind {
  UNFORMAL = "unformal",
  ENGAGEMENT = "engagement",
  MARRIAGE = "marriage",
  SEPARATION = "separation",
  DIVORCE = "divorce",
};