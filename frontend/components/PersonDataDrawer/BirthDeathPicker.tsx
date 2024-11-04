import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { EventInLife } from "@/lib/personInterfaces";
import { Input } from "../ui/input";
import { DateInput } from "./DateInput";

interface Props {
  birth: EventInLife;
  death: EventInLife;
  setBirth: (birth: EventInLife) => void;
  setDeath: (death: EventInLife) => void;
}

export function BirthDeathPicker({ birth, death, setBirth, setDeath }: Props) {
  const handleBirthDateChange = (date: string) => setBirth({ ...birth, date });
  const handleBirthPlaceChange = (place: string) => setBirth({ ...birth, place });
  const handleDeathDateChange = (date: string) => setDeath({ ...death, date });
  const handleDeathPlaceChange = (place: string) => setDeath({ ...death, place });

  return (
    <>
      <h3 className="text-2xl font-semibold tracking-tight text-center mt-5">
        Data oraz miejsce narodzin i śmierci
      </h3>
      <p className="leading-7 text-center text-muted-foreground">
        Jeśli data lub miejsce są nieznane, pozostaw je puste
      </p>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
            <div className="w-10 flex justify-center text-4xl">
              ☆
            </div>
            </TableCell>
            <TableCell>
              <DateInput date={birth.date} onDateChange={handleBirthDateChange} />
            </TableCell>
            <TableCell>
              <Input
                type="text"
                placeholder="Miejsce"
                value={birth.place}
                onChange={(e) => handleBirthPlaceChange(e.target.value)}
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <div className="w-10 flex justify-center text-4xl">
                ✞
              </div>
            </TableCell>
            <TableCell>
              <DateInput date={death.date} onDateChange={handleDeathDateChange} />
            </TableCell>
            <TableCell>
              <Input
                type="text"
                placeholder="Miejsce"
                value={death.place}
                onChange={(e) => handleDeathPlaceChange(e.target.value)}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  )
}