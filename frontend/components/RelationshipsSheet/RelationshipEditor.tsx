import { Relationship, RelationshipKind } from "@/lib/relaionshipInterfaces"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { getRelationship } from "@/lib/relationshipActions";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  relationshipId: number | "new" | null;
  onSave: (r: Relationship) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function RelationshipEditor({ relationshipId, onSave, onClose, onDelete }: Props) {
  const [relationship, setRelationship] = useState<Relationship | null>(null);

  useEffect(() => {
    if (relationshipId === null) {
      setRelationship(null);
    }
    else if (relationshipId === "new") {
      setRelationship({ id: -1, partner1: -1, partner2: -1, kind: ("" as RelationshipKind) });
    }
    else {
      getRelationship(relationshipId).then((rel) => setRelationship(rel!))
    }
  }, [relationshipId]);

  const content = relationship ?
    <LoadedRelationship {...{relationship, setRelationship, onSave, onClose, onDelete }} /> :
    <div className='size-full flex items-center justify-center'><Loader2 className="h-16 w-16 animate-spin" /></div>;

  return (
    <Sheet open={!!relationshipId} modal={false}>
      <SheetContent className="flex flex-col px-0 w-96" side="left">
        {content}
      </SheetContent>
    </Sheet>
  )
}

interface LoadedRelationshipProps {
  relationship: Relationship;
  setRelationship: (r: Relationship) => void;
  onSave: (r: Relationship) => void;
  onDelete: () => void;
  onClose: () => void;
}

function LoadedRelationship({ relationship, setRelationship, onSave, onClose, onDelete }: LoadedRelationshipProps) {
  const isNewRelationship = relationship.id < 0;
  const isRelationshipValid = 
    relationship.partner1 >= 0 &&
    relationship.partner2 >= 0 &&
    (relationship.kind as string) !== "";

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
        <Button onClick={onClose} variant="outline" className="flex-1">
          Nie zapisuj
        </Button>
        <Button onClick={() => onSave(relationship)} disabled={!isRelationshipValid} className="flex-1">
          Zapisz
        </Button>
        {!isNewRelationship && <Button onClick={onDelete} variant="destructive" className="flex-1">
          Usuń
        </Button>}
      </SheetFooter>
    </>
  )
}