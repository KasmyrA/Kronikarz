export interface Relationship {
  id: number;
  uid: number;
  partner1: number;
  partner2: number;
  kind: RelationshipKind;
}

export enum RelationshipKind {
  UNFORMAL = "unformal",
  ENGAGEMENT = "engagement",
  MARRIAGE = "marriage",
  SEPARATION = "separation",
  DIVORCE = "divorce",
};