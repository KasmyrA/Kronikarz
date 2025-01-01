/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { SheetFooter } from "@/components/ui/sheet";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { EventInLife, Job, Person, Surname } from "@/lib/personInterfaces";
import { User } from "lucide-react";
import { Card } from "../ui/card";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { PersonFilesList } from "./PersonFilesList";

interface ReadingSheetProps {
  person: Person;
  onClose: () => void;
  goToEditingSheet: () => void;
} 

export function ReadingSheet({ person: { files, image, names, surnames, sex, birth, death, description, jobs }, onClose, goToEditingSheet }: ReadingSheetProps) {
  const imageFile = files.find((f) => f.id === image);
  const personImageElement = imageFile ? 
    <img src={imageFile.url} alt="Person image" className="size-full object-cover"/> :
    <User className="size-full" />;

  const nameSurname = (names.length || surnames.length) ? `${names.join(' ')} ${surnames[0]?.surname ?? ' '}`
    : sex === "F" ? "Nieznana"
    : "Nieznany";

  const birthText = formatEvent(birth);
  const deathText = formatEvent(death);

  return (
    <>
      <ScrollArea className="flex-1 pb-1" type="auto">
        <div className="mx-auto w-full max-w-xl">
          <div className="w-full flex items-center">
            <Card className="size-40 overflow-hidden mr-6">
              {personImageElement}
            </Card>
            <div className="">
              <h2 className="border-b pb-2 text-3xl font-semibold tracking-tight mb-4">
                {nameSurname}
              </h2>
              {birthText && <div className="leading-7 flex items-center">
                <p className="text-2xl mr-2">☆</p>
                <p>{birthText}</p>
              </div>}
              {deathText && <div className="leading-7 flex items-center">
                <p className="text-2xl mr-2">✞</p>
                <p>{deathText}</p>
              </div>}
            </div>
          </div>

          {description && <>
            <h3 className="text-2xl font-semibold tracking-tight text-center mt-10 mb-2">
              Opis osoby
            </h3>
            <p className="leading-7">
              {description}
            </p>
          </>}

          {surnamesSection(surnames)}
          {jobsSection(jobs)}
          <PersonFilesList files={files} />
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      <SheetFooter className="mx-auto w-full max-w-xl gap-4">
        <Button onClick={onClose} variant="outline" className="flex-1">
          Zamknij
        </Button>
        <Button onClick={goToEditingSheet} className="flex-1">
          Edytuj
        </Button>
      </SheetFooter>
    </>
  )
}

function formatEvent({ date, place }: EventInLife) {
  if (date !== "" && place !== "") {
    return `${date}, ${place}`;
  }
  return date + place;
}

function surnamesSection(surnames: Surname[]) {
  if (surnames.length === 0) {
    return null;
  }

  const jobsInputs = surnames.map(({ surname, untill }, index) => {
    return (
      <TableRow key={index}>
        <TableCell>
          <h4 className="text-xl font-semibold tracking-tight">
            {surname}
          </h4>
          {index === 0 ? "Używane obecnie" : untill && `Używane do ${untill}`}
        </TableCell>
      </TableRow>
    )
  })

  return (
    <>
      <h3 className="text-2xl font-semibold tracking-tight text-center mt-10">
        Nazwiska
      </h3>
      <Table>
        <TableBody>
          {jobsInputs}
        </TableBody>
      </Table>
    </>
  )
}

function jobsSection(jobs: Job[]) {
  if (jobs.length === 0) {
    return null;
  }

  const jobsInputs = jobs.map(({ name, place, from, untill }, index) => {
    return (
      <TableRow key={index}>
        <TableCell>
          <h4 className="text-xl font-semibold tracking-tight">
            {[name, place].filter(s => !!s).join(', ')}
          </h4>
          {from === "" ? '?' : from} - {untill === "" ? '*' : untill}
        </TableCell>
      </TableRow>
    )
  })

  return (
    <>
      <h3 className="text-2xl font-semibold tracking-tight text-center mt-10">
        Prace
      </h3>
      <Table>
        <TableBody>
          {jobsInputs}
        </TableBody>
      </Table>
    </>
  )
}