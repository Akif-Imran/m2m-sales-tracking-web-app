import { DateValue } from "@mantine/dates";

export const DATE_FORMAT_YYYY_MM_DD = (date: Date | DateValue): string => {
  if (!date) return "Invalid Date";
  return `${date?.getFullYear()}-${(date?.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date?.getDate().toString().padStart(2, "0")}`;
};
