"use client"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface Props {
  isOpened: boolean;
  close: () => void;
  print: () => void;
  exportJson: () => void;
}

export function MenuSheet({ isOpened, close, print, exportJson }: Props) {
  return (
    <Sheet open={isOpened} onOpenChange={(o) => !o && close()}>
      <SheetContent className="flex flex-col px-0 w-96" side="left">
        <SheetHeader className="mx-6">
          <VisuallyHidden>
            <SheetTitle />
            <SheetDescription />
          </VisuallyHidden>
          <div className="flex items-center justify-center space-x-2 w-full my-6">
            <BookOpen className="size-8" />
            <span className="text-4xl font-semibold tracking-tight">
              Kronikarz
            </span>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6" type="auto">
          <Link href="/tree">
            <Button variant="outline" className="w-full mb-2">
              Idź do listy drzew
            </Button>
          </Link>

          <Button onClick={print} variant="outline" className="w-full mb-2">
            Drukuj
          </Button>

          <Button onClick={exportJson} variant="outline" className="w-full mb-2">
            Eksportuj do pliku json
          </Button>

          <ScrollBar orientation="vertical" />
        </ScrollArea>

        <SheetFooter className="mx-6">
          <Button onClick={close} className="flex-1">
            Zamknij
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}