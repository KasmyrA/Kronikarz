/* eslint-disable @next/next/no-img-element */
"use client"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TreePerson } from "@/lib/treeInterfaces";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getNameSurname, relationshipKindToString } from "@/lib/utils";
import { Plus, User } from "lucide-react";
import { Relationship } from "@/lib/relaionshipInterfaces";
import { Card } from "../ui/card";

interface Props {
  isOpened: boolean;
  relationships: Relationship[];
  people: TreePerson[];
  onRelationshipClick: (r: number | "new") => void;
  onClose: () => void;
}

export function RelationshipsList({ isOpened, relationships, people, onRelationshipClick, onClose }: Props) {
  const relCards = relationships.map((rel) => {
    const partner1 = people.find((p) => p.id === rel.partner1)!;
    const partner2 = people.find((p) => p.id === rel.partner2)!;

    return (
      <Button key={rel.id} onClick={() => onRelationshipClick(rel.id)} variant="outline" className="w-full h-auto p-4 block mt-4">
        <div className="flex justify-around">
          <PartnerImage person={partner1} />
          <PartnerImage person={partner2} />
        </div>
        <h4 className="mt-4 text-xl font-semibold tracking-tight w-full">
          {getNameSurname(partner1)} i {getNameSurname(partner2)}
        </h4>
        <h4 className="text-sm text-muted-foreground text-center w-full">
          {relationshipKindToString[rel.kind]}
        </h4>
      </Button>
    )
  })

  return (
    <Sheet open={isOpened} modal={false}>
      <SheetContent className="flex flex-col px-0 w-96" side="left">
        <SheetHeader className="mx-6">
          <SheetTitle>Związki</SheetTitle>
          <SheetDescription>Przeglądaj, dodawaj, usuwaj i edytuj związki</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6" type="auto">
          <Button onClick={() => onRelationshipClick("new")} variant="outline" className="w-full h-40 flex flex-col items-center justify-center">
            <Plus className="size-8" />
            Dodaj związek
          </Button>
          {relCards}
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        <SheetFooter className="mx-6">
          <Button onClick={onClose} className="flex-1">
            Zamknij
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

interface PartnerImage {
  person: TreePerson
}

function PartnerImage({ person }: PartnerImage) {
  const image = person.image ? 
    <img src={person.image} alt="Person image" className="size-full object-cover"/> :
    <User className="size-full" />;

  return (
    <Card className="size-32 overflow-hidden">
      {image}
    </Card>
  )
}