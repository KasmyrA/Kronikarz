export interface Relationship {
  id: number;
  partner1: number;
  partner2: number;
  kind: RelationshipKind;
}

export type RelationshipKind = "unformal" | "engagement" | "marriage" | "separation" | "divorce";