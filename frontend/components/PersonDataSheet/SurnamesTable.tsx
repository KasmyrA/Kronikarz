import { Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { KeyedState } from "@/lib/useKeyedState";
import { ChangeEvent } from "react";
import { Input } from "../ui/input";
import { Surname } from "@/lib/personInterfaces";
import { DateInput } from "./DateInput";
import { Label } from "../ui/label";

interface Props {
  surnames: KeyedState<Surname>[];
  addSurname: (name: Surname) => void;
  updateSurname: (key: string, surname: Surname) => void;
  deleteSurname: (key: string) => void;
}

export function SurnamesTable({ surnames, addSurname, updateSurname, deleteSurname }: Props) {
  const surnamesInputs = surnames.map((surname, i) => {
    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => updateSurname(surname.key, { ...surname.value, surname: e.target.value });
    const handleUntillDateChange = (untill: string) => updateSurname(surname.key, { ...surname.value, untill });
    const handleDelete = () => deleteSurname(surname.key);

    const isFirst = i === 0;
    if (isFirst && surname.value.untill !== "") {
      handleUntillDateChange("");
    }

    return (
      <TableRow key={surname.key}>
        <TableCell>
          <Label>Nazwisko</Label>
          <Input type="text" placeholder="Nazwisko" value={surname.value.surname} onChange={handleTextChange}/>
        </TableCell>
        <TableCell>
          <Label>Do kiedy używano nazwiska</Label>
          <DateInput date={surname.value.untill ?? ""} onDateChange={handleUntillDateChange} disabled={isFirst} />
        </TableCell>
        <TableCell className="w-10">
          <Button size="icon" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    )
  })

  const handleAddNewSurname = () => addSurname({ surname: "", untill: "" });

  return (
    <>
      <h3 className="text-2xl font-semibold tracking-tight text-center mt-5">
        Nazwiska
      </h3>
      <p className="leading-7 text-center text-muted-foreground">
        Nazwiska w kolejności od aktualnego do najdawniejszego
      </p>
      <Table>
        <TableBody>
          {surnamesInputs}
          <TableRow>
            <TableCell colSpan={3}>
              <Button onClick={handleAddNewSurname} className="w-full">
                <Plus className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  )
}