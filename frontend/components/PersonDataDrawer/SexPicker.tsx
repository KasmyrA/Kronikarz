import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";

interface Props {
  sex: "F" | "M" | null;
  setSex: (sex: "F" | "M" | null) => void;
}

export function SexPicker({ sex, setSex }: Props) {
  const handleGenderButtonClick = (newSex: "F" | "M") => {
    return () => newSex === sex ? setSex(null) : setSex(newSex);
  }

  return (
    <>
      <h3 className="text-2xl font-semibold tracking-tight text-center mt-5">
        Płeć
      </h3>
      <p className="leading-7 text-center text-muted-foreground">
        Biologiczna płeć osoby
      </p>
      <Table>
        <TableBody>
          <TableRow>
          <TableCell>
            <Button onClick={handleGenderButtonClick("F")} variant={sex === "F" ? "default" : "outline"} className="w-full">
              ♀
            </Button>
          </TableCell>
          <TableCell>
            <Button onClick={handleGenderButtonClick("M")} variant={sex === "M" ? "default" : "outline"} className="w-full">
              ♂
            </Button>
          </TableCell>
        </TableRow>
        </TableBody>
      </Table>
    </>
  )
}