export const LINE_OPTIONS = [
  "01호선",
  "02호선",
  "03호선",
  "04호선",
  "05호선",
  "06호선",
  "07호선",
  "08호선",
  "09호선",
];

export function normalizeLine(input) {
  const m = String(input).match(/^(\d{1,2})호선$/);
  return m ? `${String(m[1]).padStart(2, "0")}호선` : input;
}
