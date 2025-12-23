export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const startYear = 2018;
const currentYear = new Date().getFullYear();
export const years = Array.from(
  { length: currentYear - startYear + 1 },
  (_, i) => startYear + i
);
