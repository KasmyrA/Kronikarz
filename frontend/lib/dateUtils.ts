export function parseDate(date: string | null) {
  const dateParts = date?.split(".") ?? [];
  return [
    dateParts[0] ?? "",
    dateParts[1] ?? "",
    dateParts[2] ?? "",
  ]
}

export function createDate(year: string, month: string, day: string) {
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

  if (parts.length === 0) return null;
  return parts.join(".");
}