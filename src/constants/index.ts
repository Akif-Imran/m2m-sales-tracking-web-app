import { colors } from "@theme";

//regex
export const validWebsiteURL =
  /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?$/;
//localStorage keys
export const MODULE_SLICE_STORAGE_KEY = "m2m-sales-tracking-module";

export const DAY_MM_DD_YYYY_HH_MM_SS_A = "EEE dd MMM, yyyy hh:mm:ss a";
export const YYYY_MM_DD_HH_MM_SS_A = "yyyy-MM-dd hh:mm:ss a";
export const DAY_MM_DD_YYYY = "EEE dd MMM, yyyy";
export const HH_MM_SS_A = "hh:mm:ss a";

export const VehicleModeColor: Record<string, [string, string]> = {
  // faulty: ["red", colors.error],
  // offline: ["yellow", colors.warning],
  idling: ["yellow", colors.warning],
  parked: ["blue", colors.info],
  moving: ["green", colors.primary],
};

export const PoiTypesColor: Record<string, string> = {
  private: colors.error,
  business: colors.primary,
  total: colors.titleText,
} as const;

export const projectStatusColors: Record<number, string> = {
  1: "red",
  2: "yellow",
  3: "orange",
  4: "blue",
  5: "cyan",
  6: "green",
};

export const userStatusColors: Record<number, string> = {
  1: "red",
  2: "yellow",
  3: "green",
  4: "blue",
};

export const purchaseRequestStatusColors: Record<number, string> = {
  1: "red",
  2: "green",
  3: "orange",
  4: "blue",
};
export const claimStatusColors: Record<number, string> = {
  1: "red",
  2: "green",
  3: "orange",
  5: "blue",
};
export const leavesStatusColors: Record<number, string> = {
  1: "red",
  2: "green",
  3: "orange",
};
export const leavesTypeColors: Record<string, string> = {
  Unpaid: "green",
  Paid: "red",
};

export const taskStatusColors: Record<number, string> = {
  1: "red",
  2: "blue",
  3: "green",
};
export const stockItemStatusColors: Record<number, string> = {
  1: "green",
  2: "red",
};

export enum DriverFilters {
  "ALL" = 1,
  "ASSIGNED" = 2,
  "UNASSIGNED" = 3,
}
export enum ActivityFilters {
  "ALL" = 1,
}

export const currencyList = [
  { value: "MYR", label: "MYR" },
  // { value: "USD", label: "USD" },
  // { value: "CAD", label: "CAD" },
];

export const monthsList = [
  {
    value: "1",
    label: "January",
  },
  {
    value: "2",
    label: "February",
  },
  {
    value: "3",
    label: "March",
  },
  {
    value: "4",
    label: "April",
  },
  {
    value: "5",
    label: "May",
  },
  {
    value: "6",
    label: "June",
  },
  {
    value: "7",
    label: "July",
  },
  {
    value: "8",
    label: "August",
  },
  {
    value: "9",
    label: "September",
  },
  {
    value: "10",
    label: "October",
  },
  {
    value: "11",
    label: "November",
  },
  {
    value: "12",
    label: "December",
  },
];

export const malaysianStatesList = [
  { label: "Johor", value: "Johor" },
  { label: "Kedah", value: "Kedah" },
  { label: "Kelantan", value: "Kelantan" },
  { label: "Kuala Lumpur", value: "Kuala Lumpur" },
  { label: "Labuan", value: "Labuan" },
  { label: "Melaka", value: "Melaka" },
  { label: "Negeri Sembilan", value: "Negeri Sembilan" },
  { label: "Pahang", value: "Pahang" },
  { label: "Perak", value: "Perak" },
  { label: "Perlis", value: "Perlis" },
  { label: "Pulau Pinang", value: "Pulau Pinang" },
  { label: "Putrajaya", value: "Putrajaya" },
  { label: "Sabah", value: "Sabah" },
  { label: "Sarawak", value: "Sarawak" },
  { label: "Selangor", value: "Selangor" },
  { label: "Terengganu", value: "Terengganu" },
];

export const excludedCompany = "658c34fecc36b5738082a41f";
