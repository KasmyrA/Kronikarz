export interface Relationship {
  id: number;
  partner1: number;
  partner2: number;
  stages: RelationshipStage[];
}

export interface RelationshipStage {
  kind: RelationshipKind;
  date: string;
}

export type RelationshipKind = "unformal" | "engagement" | "marriage" | "separation" | "divorce";