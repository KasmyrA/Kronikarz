import { Input } from "../ui/input";

function parseDate(date: string) {
  const dateParts = date.split(".") ?? [];
  return [
    dateParts[0] ?? "",
    dateParts[1] ?? "",
    dateParts[2] ?? "",
  ]
}

function createDate(year: string, month: string, day: string) {
  const parts = [];

  if (year) {
    parts.push(year);
    if (month) {
      parts.push(month);
      if (day) {
        parts.push(day);
      }
    }
  }

  return parts.join(".");
}

interface Props {
  date: string;
  onDateChange: (date: string) => void;
  disabled?: boolean;
}

export function DateInput({ date, onDateChange, disabled }: Props) {
  const currentYear = new Date().getFullYear();
  const [year, month, day] = parseDate(date);
  const daysInMonth = month ? new Date(+year, +month, 0).getDate() : 0;

  const handleDateChange = (year: string, month: string, day: string) => {
    onDateChange(createDate(year, month, day));
  }

  return (
    <div className="flex items-end">
      <Input
        type="number"
        placeholder="Rok"
        min={1}
        max={currentYear}
        disabled={disabled}
        value={year}
        onChange={(e) => handleDateChange(e.target.value, month, day)}
      />
      <b>.</b>
      <Input
        type="number"
        placeholder="Miesiąc"
        min={1}
        max={12}
        disabled={!year}
        value={month}
        onChange={(e) => handleDateChange(year, e.target.value, day)}
      />
      <b>.</b>
      <Input
        type="number"
        placeholder="Dzień"
        min={1}
        max={daysInMonth}
        disabled={!month}
        value={day}
        onChange={(e) => handleDateChange(year, month, e.target.value)}
      />
    </div>
  )
}