import { Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { KeyedState } from "@/lib/useKeyedState";
import { ChangeEventHandler } from "react";
import { Input } from "../ui/input";

interface Props {
  names: KeyedState<string>[];
  addName: (name: string) => void;
  updateName: (key: string, name: string) => void;
  deleteName: (key: string) => void;
}

export function NamesTable({ names, addName, updateName, deleteName }: Props) {
  const namesInputs = names.map((name) => {
    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      updateName(name.key, e.target.value);
    }

    const handleDelete = () => deleteName(name.key);

    return (
      <TableRow key={name.key}>
        <TableCell>
          <Input type="text" placeholder="Imie" value={name.value} onChange={handleChange}/>
        </TableCell>
        <TableCell className="w-10">
          <Button size="icon" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    )
  })

  const handleAddNewName = () => addName("");

  return (
    <>
      <h3 className="text-2xl font-semibold tracking-tight text-center">
        Imiona
      </h3>
      <Table>
        <TableBody>
          {namesInputs}
          <TableRow>
            <TableCell colSpan={2}>
              <Button onClick={handleAddNewName} className="w-full">
                <Plus className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  )
}