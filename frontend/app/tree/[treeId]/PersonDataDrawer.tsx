"use client"

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

interface Props {
  person: any;
  closeDrawer: () => void;
}

export function PersonDataDrawer({ person, closeDrawer }: Props) {
  return (
    <Drawer open={!!person}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{person?.names} {person?.surname}</DrawerTitle>
            <DrawerDescription>
              {person?.birthDate ?? '?'} - {person?.deathDate ?? '*'}
            </DrawerDescription>
          </DrawerHeader>
          
          <DrawerFooter>
            <Button>Zapisz</Button>
            <DrawerClose asChild>
              <Button onClick={closeDrawer} variant="outline">Zamknij</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}