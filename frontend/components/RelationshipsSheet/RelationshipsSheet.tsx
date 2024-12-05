"use client"
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { TreePerson } from "@/lib/treeInterfaces";
import { useState } from "react";
import { RelationshipsList } from "./RelationshipsList";
import { RelationshipEditor } from "./RelationshipEditor";
import { getRelationship } from "@/lib/relationshipActions";
import { Relationship } from "@/lib/relaionshipInterfaces";

interface Props {
  people: TreePerson[];
  relationships: Relationship[];
  setRelationships: (r: Relationship[]) => void;
  isOpened: boolean;
  closeSheet: () => void;
}

export function RelationshipsSheet({ relationships, setRelationships, people, isOpened, closeSheet }: Props) {
  const [editedRelation, setEditedRelation] = useState<number | "new" | null>(null);

  const goToList = async (updatedId?: number) => {
    setEditedRelation(null);

    if (updatedId === undefined)  return;

    const updatedRelationIndex = relationships.findIndex((r) => r.id === updatedId);
    const newRelationData = await getRelationship(updatedId);

    if (!newRelationData) {
      relationships.splice(updatedRelationIndex, 1);
    } else if (updatedRelationIndex === -1) {
      relationships.push(newRelationData)
    } else {
      relationships[updatedRelationIndex] = newRelationData;
    }

    setRelationships({ ...relationships });
  };

  const content = editedRelation !== null ? 
    <RelationshipEditor relationshipId={editedRelation} goToList={goToList}/> :
    <RelationshipsList {...{relationships, people, goToRelationEditor: setEditedRelation, closeSheet}} />;

  return (
    <Sheet open={isOpened} modal={false}>
      <SheetContent className="flex flex-col px-0 w-96" side="left">
        {content}
      </SheetContent>
    </Sheet>
  )
}
