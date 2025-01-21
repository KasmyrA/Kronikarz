/* eslint-disable @next/next/no-img-element */
import { Relationship, RelationshipKind } from "@/lib/relaionshipInterfaces"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { getRelationship } from "@/lib/relationshipActions";
import { useEffect, useState } from "react";
import { Loader2, User } from "lucide-react";
import { Card } from "../ui/card";
import { TreePerson } from "@/lib/treeInterfaces";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getNameSurname, relationshipKindToString } from "@/lib/utils";

export interface PartnerPicker {
  pickPartner: (personId: number) => void;
  forbiddenPartnerIds: number[];
  partnerNumber: 1 | 2;
};

interface Props {
  relationshipId: number | "new" | null;
  people: TreePerson[];
  partnerPicker: PartnerPicker | null;
  setPartnerPicker: (pp: PartnerPicker | null) => void;
  onSave: (r: Relationship) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function RelationshipEditor({ relationshipId, people, partnerPicker, setPartnerPicker, onSave, onClose, onDelete }: Props) {
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
    <LoadedRelationship {...{relationship, people, setRelationship, partnerPicker, setPartnerPicker, onSave, onClose, onDelete }} /> :
    <div className='size-full flex items-center justify-center'><Loader2 className="h-16 w-16 animate-spin" /></div>;

  return (
    <Sheet open={!!relationshipId} modal={false}>
      <SheetContent className="flex flex-col px-0 w-96" side="left">
        <SheetHeader className="mx-6">
          <SheetTitle>Edytuj związek</SheetTitle>
          <SheetDescription>Uzupełnij informacje o związku</SheetDescription>
        </SheetHeader>

        {content}
      </SheetContent>
    </Sheet>
  )
}

interface LoadedRelationshipProps {
  relationship: Relationship;
  people: TreePerson[];
  partnerPicker: PartnerPicker | null;
  setPartnerPicker: (pp: PartnerPicker | null) => void;
  setRelationship: (r: Relationship) => void;
  onSave: (r: Relationship) => void;
  onDelete: () => void;
  onClose: () => void;
}

function LoadedRelationship({ relationship, people, partnerPicker, setPartnerPicker, setRelationship, onSave, onClose, onDelete }: LoadedRelationshipProps) {
  const isNewRelationship = relationship.id < 0;
  const isRelationshipValid = 
    relationship.partner1 >= 0 &&
    relationship.partner2 >= 0 &&
    (relationship.kind as string) !== "";
  
  const partner1 = people.find((p) => p.id === relationship.partner1);
  const partner2 = people.find((p) => p.id === relationship.partner2);

  const forbiddenPartnerIds = [relationship.partner1, relationship.partner2];

  // Cleanup on component destroy
  useEffect(() => {
    return () => {
      setPartnerPicker(null);
    };
  }, [setPartnerPicker])

  return (
    <>
      <ScrollArea className="flex-1 p-6" type="auto">
        <PartnerPickerComponent 
          title="Pierwszy partner"
          person={partner1}
          isPicking={partnerPicker?.partnerNumber === 1}
          cancelPicking={() => setPartnerPicker(null)}
          startPicking={() => setPartnerPicker({
            partnerNumber: 1,
            forbiddenPartnerIds,
            pickPartner: (id) => { setRelationship({...relationship, partner1: id}); setPartnerPicker(null) }
          })}
        />

        <PartnerPickerComponent 
          title="Drugi partner"
          person={partner2}
          isPicking={partnerPicker?.partnerNumber === 2}
          cancelPicking={() => setPartnerPicker(null)}
          startPicking={() => setPartnerPicker({
            partnerNumber: 2,
            forbiddenPartnerIds,
            pickPartner: (id) => { setRelationship({...relationship, partner2: id}); setPartnerPicker(null) }
          })}
        />

        <RelationshipKindPicker
          kind={relationship.kind}
          setKind={(kind) => setRelationship({...relationship, kind})}
        />

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

interface PartnerPickerProps {
  title: string;
  person: TreePerson | undefined;
  isPicking: boolean;
  startPicking: () => void;
  cancelPicking: () => void;
}

function PartnerPickerComponent({ title, person, isPicking, startPicking, cancelPicking }: PartnerPickerProps) {
  const image = person?.image ? 
    <img src={person.image} alt="Person image" className="size-full object-cover"/> :
    <User className="size-full" />;

  const nameSurname = !person ? "Wybierz osobę" : getNameSurname(person);

  const [buttonText, variant, onClick] = isPicking ?
    ["Anuluj wybieranie", "outline", cancelPicking] as const :
    ["Wybierz osobę", "default", startPicking] as const;

  return (
    <>
      <h3 className="text-2xl font-semibold tracking-tight text-center mt-6 mb-4">
        {title}
      </h3>
      <Card className="size-40 m-auto overflow-hidden">
        {image}
      </Card>
      <h3 className="my-4 text-xl font-semibold tracking-tight text-center">
        {nameSurname}
      </h3>
      <Button onClick={onClick} variant={variant} className="w-full">{buttonText}</Button>
    </>
  )
}

interface RelationshipKindPickerProps {
  kind: RelationshipKind;
  setKind: (k: RelationshipKind) => void;
}

function RelationshipKindPicker({ kind, setKind }: RelationshipKindPickerProps) {
  const avaliableKinds = Object.values(RelationshipKind).map((k) => {
    return (
      <SelectItem key={k} value={k}>
        {relationshipKindToString[k]}
      </SelectItem>
    )
  })

  return (
    <>
      <h3 className="text-2xl font-semibold tracking-tight text-center mt-5 mb-4">
        Typ związku
      </h3>
      <Select onValueChange={setKind} value={kind}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {avaliableKinds}
        </SelectContent>
      </Select>
    </>
  )
}