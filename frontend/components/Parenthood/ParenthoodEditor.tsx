/* eslint-disable @next/next/no-img-element */
import { Parenthood, ParenthoodType } from "@/lib/parenthoodInterfaces"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { getParenthood } from "@/lib/parenthoodActions";
import { useEffect, useState } from "react";
import { Loader2, User } from "lucide-react";
import { Card } from "../ui/card";
import { TreePerson } from "@/lib/treeInterfaces";
import { getNameSurname } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export interface ParentPicker {
  pickParent: (personId: number) => void;
  forbiddenParentIds: number[];
  parentNumber: 1 | 2 | 3;
};

interface Props {
  parenthoodId: number | "new" | null;
  people: TreePerson[];
  parentPicker: ParentPicker | null;
  setParentPicker: (pp: ParentPicker | null) => void;
  onSave: (p: Parenthood) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function ParenthoodEditor({ parenthoodId, people, parentPicker, setParentPicker, onSave, onClose, onDelete }: Props) {
  const [parenthood, setParenthood] = useState<Parenthood | null>(null);

  useEffect(() => {
    if (parenthoodId === null) {
      setParenthood(null);
    }
    else if (parenthoodId === "new") {
      setParenthood({ id:0, mother: -1, father: -1, child: -1, type: "biological", startDate: null, endDate: null, adoption: null });
    }
    else {
      getParenthood(parenthoodId).then((p) => setParenthood(p!))
    }
  }, [parenthoodId]);

  const content = parenthood ?
    <LoadedParenthood {...{parenthood, people, setParenthood, parentPicker, setParentPicker, onSave, onClose, onDelete }} /> :
    <div className='size-full flex items-center justify-center'><Loader2 className="h-16 w-16 animate-spin" /></div>;

  return (
    <Sheet open={!!parenthoodId} modal={false}>
      <SheetContent className="flex flex-col px-0 w-96" side="left">
        <SheetHeader className="mx-6">
          <SheetTitle>Edytuj rodzicielstwo</SheetTitle>
          <SheetDescription>Uzupełnij informacje o rodzicielstwie</SheetDescription>
        </SheetHeader>

        {content}
      </SheetContent>
    </Sheet>
  )
}

interface LoadedParenthoodProps {
  parenthood: Parenthood;
  people: TreePerson[];
  parentPicker: ParentPicker | null;
  setParentPicker: (pp: ParentPicker | null) => void;
  setParenthood: (p: Parenthood) => void;
  onSave: (p: Parenthood) => void;
  onDelete: () => void;
  onClose: () => void;
}

function LoadedParenthood({ parenthood, people, parentPicker, setParentPicker, setParenthood, onSave, onClose, onDelete }: LoadedParenthoodProps) {
  const isNewParenthood = parenthood.child < 0;
  const isParenthoodValid = 
    parenthood.mother >= 0 &&
    parenthood.father >= 0 &&
    parenthood.child >= 0 &&
    (parenthood.type === "biological" || parenthood.type === "adoptive"); // Corrected condition

  const mother = people.find((p) => p.id === parenthood.mother);
  const father = people.find((p) => p.id === parenthood.father);
  const child = people.find((p) => p.id === parenthood.child);

  const forbiddenParentIds = [parenthood.mother, parenthood.father, parenthood.child];

  // Cleanup on component destroy
  useEffect(() => {
    return () => {
      setParentPicker(null);
    };
  }, [setParentPicker])

  return (
    <>
      <ScrollArea className="flex-1 p-6" type="auto">
        <ParentPickerComponent 
          title="Matka"
          person={mother}
          isPicking={parentPicker?.parentNumber === 1}
          cancelPicking={() => setParentPicker(null)}
          startPicking={() => setParentPicker({
            parentNumber: 1,
            forbiddenParentIds,
            pickParent: (id) => { setParenthood({...parenthood, mother: id}); setParentPicker(null) }
          })}
        />

        <ParentPickerComponent 
          title="Ojciec"
          person={father}
          isPicking={parentPicker?.parentNumber === 2}
          cancelPicking={() => setParentPicker(null)}
          startPicking={() => setParentPicker({
            parentNumber: 2,
            forbiddenParentIds,
            pickParent: (id) => { setParenthood({...parenthood, father: id}); setParentPicker(null) }
          })}
        />

        <ParentPickerComponent 
          title="Dziecko"
          person={child}
          isPicking={parentPicker?.parentNumber === 3}
          cancelPicking={() => setParentPicker(null)}
          startPicking={() => setParentPicker({
            parentNumber: 3,
            forbiddenParentIds,
            pickParent: (id) => { setParenthood({...parenthood, child: id}); setParentPicker(null) }
          })}
        />

        <ParenthoodTypePicker
          type={parenthood.type}
          setType={(type) => setParenthood({...parenthood, type})}
        />

        <ScrollBar orientation="vertical" />
      </ScrollArea>

      <SheetFooter className="mx-6 gap-4">
        <Button onClick={onClose} variant="outline" className="flex-1">
          Nie zapisuj
        </Button>
        <Button onClick={() => onSave(parenthood)} disabled={!isParenthoodValid} className="flex-1">
          Zapisz
        </Button>
        {!isNewParenthood && <Button onClick={onDelete} variant="destructive" className="flex-1">
          Usuń
        </Button>}
      </SheetFooter>
    </>
  )
}

interface ParentPickerProps {
  title: string;
  person: TreePerson | undefined;
  isPicking: boolean;
  startPicking: () => void;
  cancelPicking: () => void;
}

function ParentPickerComponent({ title, person, isPicking, startPicking, cancelPicking }: ParentPickerProps) {
  const image = person?.imageUrl ? 
    <img src={person.imageUrl} alt="Person image" className="size-full object-cover"/> :
    <User className="size-full" />;

  const nameSurname = !person ? "Wybierz osobę" : getNameSurname(person);

  const [buttonText, variant, onClick] = isPicking ?
    ["Anuluj wybieranie", "outline", cancelPicking] as const :
    ["Wybierz osobę", "default", startPicking] as const;

  return (
    <>
      <h3 className="text-2xl font-semibold tracking-tight text-center mt-6 mb-4">
        {title}
      </h3>
      <Card className="size-40 m-auto overflow-hidden">
        {image}
      </Card>
      <h3 className="my-4 text-xl font-semibold tracking-tight text-center">
        {nameSurname}
      </h3>
      <Button onClick={onClick} variant={variant} className="w-full">{buttonText}</Button>
    </>
  )
}

interface ParenthoodTypePickerProps {
  type: ParenthoodType;
  setType: (t: ParenthoodType) => void;
}

function ParenthoodTypePicker({ type, setType }: ParenthoodTypePickerProps) {
  const availableTypes = ["biological", "adoptive"].map((t) => {
    return (
      <SelectItem key={t} value={t}>
        {t}
      </SelectItem>
    )
  })

  return (
    <>
      <h3 className="text-2xl font-semibold tracking-tight text-center mt-5 mb-4">
        Typ rodzicielstwa
      </h3>
      <Select onValueChange={setType} value={type}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableTypes}
        </SelectContent>
      </Select>
    </>
  )
}
