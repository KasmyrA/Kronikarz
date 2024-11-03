export function parseDate(date: string) {
  const dateParts = date.split(".") ?? [];
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

  return parts.join(".");
}