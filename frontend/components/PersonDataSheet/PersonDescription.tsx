import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Textarea } from "../ui/textarea";

interface Props {
  description: string;
  setDescription: (description: string) => void;
}

export function PersonDescription({ description, setDescription }: Props) {
  return (
    <>
      <h3 className="text-2xl font-semibold tracking-tight text-center mt-5">
        Opis osoby
      </h3>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Textarea
                placeholder="Wpisz tutaj opis osoby"
                value={description}
                onChange={(e) => setDescription(e.target.value)}/>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  )
}