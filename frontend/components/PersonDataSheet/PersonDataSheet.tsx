"use client"

import { getPerson } from "@/lib/personActions";
import { Person } from "@/lib/personInterfaces";
import { TreePerson } from "@/lib/treeInterfaces";
import { useEffect, useState } from "react";
import { EditingSheet } from "./EditingSheet";
import { ReadingSheet } from "./ReadingSheet";
import { Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";

interface Props {
  person: TreePerson | null;
  onClose: () => void;
}

export function PersonDataSheet({ person, onClose }: Props) {
  const [pers, setPers] = useState<Person | null>(null)

  useEffect(() => {
    if (person) {
      getPerson(person.id).then((p) => setPers(p!));
    }
    else {
      setPers(null);
    }
  }, [person]);

  const content = pers ? 
    <OpenedSheet closeSheet={onClose} person={pers} /> :
    <div className='size-full flex items-center justify-center'><Loader2 className="h-16 w-16 animate-spin" /></div>;

  return (
    <Sheet open={!!person}>
      <SheetContent className="h-[90vh] flex flex-col px-0" side="bottom">
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  )
}

interface OpenedSheetProps {
  person: Person;
  closeSheet: () => void;
}

function OpenedSheet(props: OpenedSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const goToEditingSheet = () => setIsEditing(true);

  if (isEditing) {
    return <EditingSheet {...props} />
  }

  return <ReadingSheet {...props} goToEditingSheet={goToEditingSheet} />
}
