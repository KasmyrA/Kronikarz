import { Relationship, RelationshipKind } from "@/lib/relaionshipInterfaces"
import { SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { createRelationship, deleteRelationship, getRelationship, updateRelationship } from "@/lib/relationshipActions";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  relationshipId: number | "new";
  goToList: (updatedId?: number) => void;
}

export function RelationshipEditor({ relationshipId, goToList }: Props) {
  const [relationship, setRelationship] = useState<Relationship | null>(null);

  useEffect(() => {
    if (relationshipId === "new") {
      setRelationship({ id: -1, partner1: -1, partner2: -1, kind: ("" as RelationshipKind) });
    }
    else {
      getRelationship(relationshipId).then((rel) => setRelationship(rel!))
    }
  }, [relationshipId]);

  if (!relationship) {
    return <div className='size-full flex items-center justify-center'><Loader2 className="h-16 w-16 animate-spin" /></div>;
  }

  return <LoadedRelationship {...{relationship, setRelationship, goToList }} />;
}

interface LoadedRelationshipProps {
  relationship: Relationship;
  setRelationship: (r: Relationship) => void;
  goToList: (updatedId?: number) => void;
}

function LoadedRelationship({ relationship, setRelationship, goToList }: LoadedRelationshipProps) {
  const isNewRelationship = relationship.id < 0;
  const isRelationshipValid = 
    relationship.partner1 >= 0 &&
    relationship.partner2 >= 0 &&
    (relationship.kind as string) !== "";

  const handleSave = async () => {
    if (isNewRelationship) {
      const { id } = await createRelationship(relationship);
      goToList(id);
    } else {
      await updateRelationship(relationship);
      goToList(relationship.id);
    }
  };

  const handleDelete = async () => {
    await deleteRelationship(relationship);
    goToList(relationship.id);
  };

  return (
    <>
      <SheetHeader className="mx-6">
        <SheetTitle>Edytuj związek</SheetTitle>
        <SheetDescription>Uzupełnij informacje o związku</SheetDescription>
      </SheetHeader>

      <ScrollArea className="flex-1 p-6" type="auto">
        
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      <SheetFooter className="mx-6 gap-4">
        <Button onClick={() => goToList()} variant="outline" className="flex-1">
          Nie zapisuj
        </Button>
        <Button onClick={handleSave} disabled={!isRelationshipValid} className="flex-1">
          Zapisz
        </Button>
        {!isNewRelationship && <Button onClick={handleDelete} variant="destructive" className="flex-1">
          Usuń
        </Button>}
      </SheetFooter>
    </>
  )
}