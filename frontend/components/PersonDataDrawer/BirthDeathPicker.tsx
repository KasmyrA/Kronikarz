import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { EventInLife } from "@/lib/personInterfaces";
import { Input } from "../ui/input";
import { createDate, parseDate } from "@/lib/dateUtils";

interface Props {
  birth: EventInLife;
  death: EventInLife;
  setBirth: (birth: EventInLife) => void;
  setDeath: (death: EventInLife) => void;
}

export function BirthDeathPicker({ birth, death, setBirth, setDeath }: Props) {
  const currentYear = new Date().getFullYear();

  const [birthYear, birthMonth, birthDay] = parseDate(birth.date);
  const daysInBirthMonth = birthMonth ? new Date(+birthYear, +birthMonth, 0).getDate() : 0;

  const [deathYear, deathMonth, deathDay] = parseDate(death.date);
  const daysInDeathMonth = deathMonth ? new Date(+deathYear, +deathMonth, 0).getDate() : 0;

  const handleBirthDateChange = (year: string, month: string, day: string) => {
    setBirth({ ...birth, date: createDate(year, month, day) });
  }

  const handleBirthPlaceChange = (place: string) => {
    setBirth({ ...birth, place });
  }

  const handleDeathDateChange = (year: string, month: string, day: string) => {
    setDeath({ ...death, date: createDate(year, month, day) });
  }

  const handleDeathPlaceChange = (place: string) => {
    setDeath({ ...death, place });
  }

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
            <TableCell className="flex items-end">
              <Input
                type="number"
                placeholder="Rok"
                min={1}
                max={currentYear}
                value={birthYear}
                onChange={(e) => handleBirthDateChange(e.target.value, birthMonth, birthDay)}
              />
              <b>.</b>
              <Input
                type="number"
                placeholder="Miesiąc"
                min={1}
                max={12}
                disabled={!birthYear}
                value={birthMonth}
                onChange={(e) => handleBirthDateChange(birthYear, e.target.value, birthDay)}
              />
              <b>.</b>
              <Input
                type="number"
                placeholder="Dzień"
                min={1}
                max={daysInBirthMonth}
                disabled={!birthMonth}
                value={birthDay}
                onChange={(e) => handleBirthDateChange(birthYear, birthMonth, e.target.value)}
              />
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
            <TableCell className="flex items-end">
              <Input
                type="number"
                placeholder="Rok"
                min={1}
                max={currentYear}
                value={deathYear}
                onChange={(e) => handleDeathDateChange(e.target.value, deathMonth, deathDay)}
              />
              <b>.</b>
              <Input
                type="number"
                placeholder="Miesiąc"
                min={1}
                max={12}
                disabled={!deathYear}
                value={deathMonth}
                onChange={(e) => handleDeathDateChange(deathYear, e.target.value, deathDay)}
              />
              <b>.</b>
              <Input
                type="number"
                placeholder="Dzień"
                min={1}
                max={daysInDeathMonth}
                disabled={!deathMonth}
                value={deathDay}
                onChange={(e) => handleDeathDateChange(deathYear, deathMonth, e.target.value)}
              />
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