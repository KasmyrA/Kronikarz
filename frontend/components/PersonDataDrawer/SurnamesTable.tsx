import { Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { KeyedState } from "@/lib/useKeyedState";
import { ChangeEventHandler } from "react";
import { Input } from "../ui/input";
import { Surname } from "@/lib/personInterfaces";
import { createDate, parseDate } from "@/lib/dateUtils";

interface Props {
  surnames: KeyedState<Surname>[];
  addSurname: (name: Surname) => void;
  updateSurname: (key: string, surname: Surname) => void;
  deleteSurname: (key: string) => void;
}

export function SurnamesTable({ surnames, addSurname, updateSurname, deleteSurname }: Props) {
  const currentYear = new Date().getFullYear();

  const namesInputs = surnames.map((surname, i) => {
    const [untillYear, untillMonth, untillDay] = parseDate(surname.value.untill);
    const daysInMonth = untillMonth ? new Date(+untillYear, +untillMonth, 0).getDate() : 0

    const handleTextChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      updateSurname(surname.key, { ...surname.value, surname: e.target.value });
    }

    const handleUntillDateChange = (untill: string) => {
      updateSurname(surname.key, { ...surname.value, untill });
    }

    const handleDelete = () => deleteSurname(surname.key);

    const isFirst = i === 0;
    if (isFirst && surname.value.untill !== "") {
      handleUntillDateChange("");
    }

    return (
      <TableRow key={surname.key}>
        <TableCell>
          <Input type="text" placeholder="Nazwisko" value={surname.value.surname} onChange={handleTextChange}/>
        </TableCell>
        <TableCell className="flex items-end">
          <Input
            type="number"
            placeholder="Rok"
            min={1}
            max={currentYear}
            disabled={isFirst}
            value={untillYear}
            onChange={(e) => handleUntillDateChange(createDate(e.target.value, untillMonth, untillDay))}
          />
          <b>.</b>
          <Input
            type="number"
            placeholder="Miesiąc"
            min={1}
            max={12}
            disabled={!untillYear}
            value={untillMonth}
            onChange={(e) => handleUntillDateChange(createDate(untillYear, e.target.value, untillDay))}
          />
          <b>.</b>
          <Input
            type="number"
            placeholder="Dzień"
            min={1}
            max={daysInMonth}
            disabled={!untillMonth}
            value={untillDay}
            onChange={(e) => handleUntillDateChange(createDate(untillYear, untillMonth, e.target.value))}
          />
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
        Nazwiska w kolejności od aktualnego oraz daty do kiedy dane nazwisko było używane
      </p>
      <Table>
        <TableBody>
          {namesInputs}
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