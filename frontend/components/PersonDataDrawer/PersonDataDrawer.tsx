"use client"

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPerson, updatePerson } from "@/lib/personActions";
import { Person } from "@/lib/personInterfaces";
import { TreePerson } from "@/lib/treeInterfaces";
import { useKeyedState } from "@/lib/useKeyedState";
import { useEffect, useState } from "react";
import { NamesTable } from "./NamesTable";
import { SurnamesTable } from "./SurnamesTable";
import { SexPicker } from "./SexPicker";

interface Props {
  person: TreePerson | null;
  closeDrawer: () => void;
}

export function PersonDataDrawer({ person, closeDrawer }: Props) {
  const [pers, setPers] = useState<Person | null>(null)

  useEffect(() => {
    if (person) {
      setTimeout(() => {
        getPerson(person.id)
          .then((p) => setPers(p!));
      }, 1000);
    }
    else {
      setPers(null);
    }
  }, [person]);

  const content = pers ? 
    <OpenedDrawer closeDrawer={closeDrawer} person={pers} /> :
    's';

  return (
    <Drawer open={!!person} dismissible={false}>
      <DrawerContent className="h-[90vh]">
        <DrawerHeader>
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        {content}
      </DrawerContent>
    </Drawer>
  )
}

interface OpenedDrawerProps {
  person: Person;
  closeDrawer: () => void;
}

function OpenedDrawer({ person, closeDrawer }: OpenedDrawerProps) {
  const [names, addName, updateName, deleteName] = useKeyedState(person.names);
  const [surnames, addSurname, updateSurname, deleteSurname] = useKeyedState(person.surnames);
  const [sex, setSex] = useState(person.sex)

  const handleSave = async () => {
    await updatePerson({
      ...person,
      names: names.map((n) => n.value),
      surnames: surnames.map((s) => s.value)
    });
    closeDrawer();
  }

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="mx-auto w-full max-w-lg">
          <NamesTable {...{names, addName, updateName, deleteName}} />
          <SurnamesTable {...{surnames, addSurname, updateSurname, deleteSurname}} />
          <SexPicker {...{sex, setSex}} />
        </div>
      </ScrollArea>

      <DrawerFooter className="mx-auto w-full max-w-lg">
        <Button onClick={handleSave}>Zapisz</Button>
        <Button onClick={closeDrawer} variant="outline">Zamknij</Button>
      </DrawerFooter>
    </>
  )
}