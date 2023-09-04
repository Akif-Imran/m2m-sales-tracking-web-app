import { colors } from "@theme";

export const DAY_MM_DD_YYYY_HH_MM_SS_A = "EEE dd MMM, yyyy hh:mm:ss a";
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

export const projectStatusColors: Record<string, string> = {
  "In Development": "blue",
  Completed: "green",
  Quotation: "red",
  "Follow Up": "yellow",
};

export const taskStatusColors: Record<string, string> = {
  Pending: "red",
  Accepted: "blue",
  Declined: "dark",
  Delayed: "orange",
  Completed: "green",
};

export enum DriverFilters {
  "ALL" = 1,
  "ASSIGNED" = 2,
  "UNASSIGNED" = 3,
}
export enum ActivityFilters {
  "ALL" = 1,
}
