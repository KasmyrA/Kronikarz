"use client"

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { getPerson } from "@/lib/personActions";
import { Person } from "@/lib/personInterfaces";
import { TreePerson } from "@/lib/treeInterfaces";
import { useEffect, useState } from "react";
import { EditingDrawer } from "./EditingDrawer";
import { ReadingDrawer } from "./ReadingDrawer";
import { Loader2 } from "lucide-react";

interface Props {
  person: TreePerson | null;
  closeDrawer: () => void;
}

export function PersonDataDrawer({ person, closeDrawer }: Props) {
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
    <OpenedDrawer closeDrawer={closeDrawer} person={pers} /> :
    <div className='flex-1 flex items-center justify-center'><Loader2 className="h-16 w-16 animate-spin" /></div>;

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

function OpenedDrawer(props: OpenedDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const goToEditingDrawer = () => setIsEditing(true);

  if (isEditing) {
    return <EditingDrawer {...props} />
  }

  return <ReadingDrawer {...props} goToEditingDrawer={goToEditingDrawer} />
}
