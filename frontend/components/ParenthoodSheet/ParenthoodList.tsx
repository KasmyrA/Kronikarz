/* eslint-disable @next/next/no-img-element */
"use client"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TreePerson } from "@/lib/treeInterfaces";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getNameSurname } from "@/lib/utils";
import { Plus, User } from "lucide-react";
import { Parenthood } from "@/lib/parenthoodInterfaces";
import { Card } from "../ui/card";

interface Props {
  isOpened: boolean;
  parenthoods: Parenthood[];
  people: TreePerson[];
  onParenthoodClick: (p: number | "new") => void;
  onClose: () => void;
}

export function ParenthoodList({ isOpened, parenthoods, people, onParenthoodClick, onClose }: Props) {
  const parenthoodCards = parenthoods.map((parenthood) => {
    const mother = people.find((p) => p.id === parenthood.mother)!;
    const father = people.find((p) => p.id === parenthood.father)!;
    const child = people.find((p) => p.id === parenthood.child)!;

    return (
      <Button key={parenthood.id} onClick={() => onParenthoodClick(parenthood.id)} variant="outline" className="w-full h-auto p-4 block mt-4">
        <div className="flex justify-around">
          <ParentImage person={mother} />
          <ParentImage person={father} />
          <ParentImage person={child} />
        </div>
        <h4 className="mt-4 text-xl font-semibold tracking-tight w-full">
          {getNameSurname(mother)} i {getNameSurname(father)} - {getNameSurname(child)}
        </h4>
      </Button>
    )
  })

  return (
    <Sheet open={isOpened} modal={false}>
      <SheetContent className="flex flex-col px-0 w-96" side="left">
        <SheetHeader className="mx-6">
          <SheetTitle>Rodzicielstwo</SheetTitle>
          <SheetDescription>Przeglądaj, dodawaj, usuwaj i edytuj rodzicielstwo</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6" type="auto">
          <Button onClick={() => onParenthoodClick("new")} variant="outline" className="w-full h-40 flex flex-col items-center justify-center">
            <Plus className="size-8" />
            Dodaj rodzicielstwo
          </Button>
          {parenthoodCards}
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

interface ParentImage {
  person: TreePerson
}

function ParentImage({ person }: ParentImage) {
  const image = person.image ? 
    <img src={person.image} alt="Person image" className="size-full object-cover"/> :
    <User className="size-full" />;

  return (
    <Card className="size-32 overflow-hidden">
      {image}
    </Card>
  )
}

