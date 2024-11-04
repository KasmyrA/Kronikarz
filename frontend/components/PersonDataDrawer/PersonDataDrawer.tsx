"use client"

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getPerson, updatePerson } from "@/lib/personActions";
import { Person } from "@/lib/personInterfaces";
import { TreePerson } from "@/lib/treeInterfaces";
import { useKeyedState } from "@/lib/useKeyedState";
import { useEffect, useState } from "react";
import { NamesTable } from "./NamesTable";
import { SurnamesTable } from "./SurnamesTable";
import { SexPicker } from "./SexPicker";
import { BirthDeathPicker } from "./BirthDeathPicker";
import { JobsTable } from "./JobsTable";
import { PersonDescription } from "./PersonDescription";

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
  const [jobs, addJob, updateJob, deleteJob] = useKeyedState(person.jobs);
  const [sex, setSex] = useState(person.sex)
  const [birth, setBirth] = useState(person.birth)
  const [death, setDeath] = useState(person.death)
  const [description, setDescription] = useState(person.description)

  const handleSave = async () => {
    await updatePerson({
      ...person,
      names: names.map((n) => n.value),
      surnames: surnames.map((s) => s.value),
      jobs: jobs.map((j) => j.value),
      sex,
      birth,
      death,
      description
    });
    closeDrawer();
  }

  return (
    <>
      <ScrollArea className="flex-1" type="auto">
        <div className="mx-auto w-full max-w-xl">
          <NamesTable {...{names, addName, updateName, deleteName}} />
          <SurnamesTable {...{surnames, addSurname, updateSurname, deleteSurname}} />
          <SexPicker {...{sex, setSex}} />
          <BirthDeathPicker {...{birth, death, setBirth, setDeath}} />
          <JobsTable {...{jobs, addJob, updateJob, deleteJob}} />
          <PersonDescription {...{description, setDescription}} />
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      <DrawerFooter className="mx-auto w-full max-w-xl">
        <Button onClick={handleSave}>Zapisz</Button>
        <Button onClick={closeDrawer} variant="outline">Zamknij</Button>
      </DrawerFooter>
    </>
  )
}