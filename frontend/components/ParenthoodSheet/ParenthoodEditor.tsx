/* eslint-disable @next/next/no-img-element */
import { Parenthood, ParenthoodKind } from "@/lib/parenthoodInterfaces"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { getParenthood } from "@/lib/parenthoodActions";
import { useEffect, useState } from "react";
import { Loader2, User } from "lucide-react";
import { Card } from "../ui/card";
import { TreePerson } from "@/lib/treeInterfaces";
import { getNameSurname, parenthoodTypeToString } from "@/lib/utils";
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
      setParenthood({ id: -1, mother: -1, father: -1, child: -1, type: ParenthoodKind.BIOLOGICAL });
    }
    else {
      getParenthood(parenthoodId).then((p) => setParenthood(p!))
    }
  }, [parenthoodId, setParenthood]);

  const content = parenthood ?
    <LoadedParenthood {...{parenthood, people, setParenthood, parentPicker, setParentPicker, onSave, onClose, onDelete }} /> :
    <div className='size-full flex items-center justify-center'><Loader2 className="h-16 w-16 animate-spin" /></div>;

  return (
    <Sheet open={!!parenthoodId} modal={false}>
      <SheetContent className="flex flex-col px-0 w-96" side="left">
        <SheetHeader className="mx-6">
          <SheetTitle>Rodzicielstwo</SheetTitle>
          <SheetDescription>Przeglądaj, dodawaj, usuwaj realacje rodzinne</SheetDescription>
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
  const isNewParenthood = parenthood.id < 0;
  const isParenthoodValid = 
    (parenthood.mother ?? -1) >= 0 &&
    (parenthood.father ?? -1) >= 0 &&
    (parenthood.child ?? -1) >= 0 &&
    (parenthood.type === ParenthoodKind.BIOLOGICAL || parenthood.type === ParenthoodKind.ADOPTIVE);

  const mother = people.find((p) => p.id === parenthood.mother);
  const father = people.find((p) => p.id === parenthood.father);
  const child = people.find((p) => p.id === parenthood.child);

  const forbiddenParentIds = [parenthood.mother, parenthood.father, parenthood.child].filter((id): id is number => id !== null && id >= 0);

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
          pickParent={parentPicker?.pickParent}
          people={people}
          forbiddenParentIds={forbiddenParentIds}
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
          pickParent={parentPicker?.pickParent}
          people={people}
          forbiddenParentIds={forbiddenParentIds}
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
          pickParent={parentPicker?.pickParent}
          people={people}
          forbiddenParentIds={forbiddenParentIds}
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
  pickParent?: (id: number) => void;
  people: TreePerson[];
  forbiddenParentIds: number[];
}

function ParentPickerComponent({ title, person, isPicking, startPicking, cancelPicking, pickParent, people, forbiddenParentIds }: ParentPickerProps) {
  const image = person?.image ? 
    <img src={person.image} alt="Person image" className="size-full object-cover"/> :
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
      {isPicking && pickParent && (
        <div className="mt-4">
          {people.filter(p => !forbiddenParentIds.includes(p.id)).map(p => (
            <Button key={p.id} onClick={() => pickParent(p.id)} className="w-full mb-2">
              {getNameSurname(p)}
            </Button>
          ))}
        </div>
      )}
    </>
  )
}

interface ParenthoodTypePickerProps {
  type: ParenthoodKind;
  setType: (t: ParenthoodKind) => void;
}

function ParenthoodTypePicker({ type, setType }: ParenthoodTypePickerProps) {
  const availableTypes = Object.values(ParenthoodKind).map((t) => {
    return (
      <SelectItem key={t} value={t}>
        {parenthoodTypeToString[t]}
      </SelectItem>
    )
  })

  return (
    <>
      <h3 className="text-2xl font-semibold tracking-tight text-center mt-5 mb-4">
        Typ rodzicielstwa
      </h3>
      <Select onValueChange={(value) => setType(value as ParenthoodKind)} value={type}>
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
