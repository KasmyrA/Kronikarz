import { Button } from "@/components/ui/button";
import { SheetFooter } from "@/components/ui/sheet";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { deletePerson, updatePerson } from "@/lib/personActions";
import { Person } from "@/lib/personInterfaces";
import { useKeyedState } from "@/lib/useKeyedState";
import { useState } from "react";
import { NamesTable } from "./NamesTable";
import { SurnamesTable } from "./SurnamesTable";
import { SexPicker } from "./SexPicker";
import { BirthDeathPicker } from "./BirthDeathPicker";
import { JobsTable } from "./JobsTable";
import { PersonDescription } from "./PersonDescription";
import { PersonFilesList } from "./PersonFilesList";
import { PersonImagePicker } from "./PersonImagePicker";

interface Props {
  person: Person;
  closeSheet: () => void;
}

export function EditingSheet({ person, closeSheet }: Props) {
  const [names, addName, updateName, deleteName] = useKeyedState(person.names);
  const [surnames, addSurname, updateSurname, deleteSurname] = useKeyedState(person.surnames);
  const [jobs, addJob, updateJob, deleteJob] = useKeyedState(person.jobs);
  const [sex, setSex] = useState(person.sex);
  const [birth, setBirth] = useState(person.birth);
  const [death, setDeath] = useState(person.death);
  const [description, setDescription] = useState(person.description);
  const [files, setFiles] = useState(person.files);
  const [image, setImage] = useState(person.image);

  const handleSave = async () => {
    await updatePerson({
      id: person.id,
      names: names.map((n) => n.value),
      surnames: surnames.map((s) => s.value),
      jobs: jobs.map((j) => j.value),
      sex,
      birth,
      death,
      description,
      image
    });
    closeSheet();
  }

  const handleDelete = async () => {
    await deletePerson(person.id);
    closeSheet();
  }

  return (
    <>
      <ScrollArea className="flex-1 pb-1 overflow-auto" type="auto">
        <div className="mx-auto w-full max-w-xl">
          <PersonImagePicker {...{image, setImage, files, setFiles, personId: person.id}} />
          <NamesTable {...{names, addName, updateName, deleteName}} />
          <SurnamesTable {...{surnames, addSurname, updateSurname, deleteSurname}} />
          <SexPicker {...{sex, setSex}} />
          <BirthDeathPicker {...{birth, death, setBirth, setDeath}} />
          <JobsTable {...{jobs, addJob, updateJob, deleteJob}} />
          <PersonDescription {...{description, setDescription}} />
          <PersonFilesList {...{files, setFiles, image, setImage, personId: person.id}} />
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      <SheetFooter className="mx-auto w-full max-w-xl gap-4">
        <Button onClick={closeSheet} variant="outline" className="flex-1">
          Nie zapisuj
        </Button>
        <Button onClick={handleSave} className="flex-1">
          Zapisz
        </Button>
        <Button onClick={handleDelete} variant="destructive" className="flex-1">
          Usuń
        </Button>
      </SheetFooter>
    </>
  )
}