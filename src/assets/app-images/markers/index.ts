import BikeInfo from "@assets/app-images/markers/bike-info.png";
import BikePrimary from "@assets/app-images/markers/bike-primary.png";
import BikeError from "@assets/app-images/markers/bike-error.png";
import BikeWarning from "@assets/app-images/markers/bike-warning.png";
import BikeGray from "@assets/app-images/markers/bike-gray.png";
import BikeDark from "@assets/app-images/markers/bike-dark.png";
import CarInfo from "@assets/app-images/markers/car-info.png";
import CarPrimary from "@assets/app-images/markers/car-primary.png";
import CarError from "@assets/app-images/markers/car-error.png";
import CarWarning from "@assets/app-images/markers/car-warning.png";
import CarGray from "@assets/app-images/markers/car-gray.png";
import CarDark from "@assets/app-images/markers/car-dark.png";
import FlagInfo from "@assets/app-images/markers/flag-info.png";
import FlagPrimary from "@assets/app-images/markers/flag-primary.png";
import FlagError from "@assets/app-images/markers/flag-error.png";
import FlagWarning from "@assets/app-images/markers/flag-warning.png";
import FlagGray from "@assets/app-images/markers/flag-gray.png";
import FlagDark from "@assets/app-images/markers/flag-dark.png";
import PersonInfo from "@assets/app-images/markers/person-info.png";
import PersonPrimary from "@assets/app-images/markers/person-primary.png";
import PersonError from "@assets/app-images/markers/person-error.png";
import PersonWarning from "@assets/app-images/markers/person-warning.png";
import PersonGray from "@assets/app-images/markers/person-gray.png";
import PersonDark from "@assets/app-images/markers/person-dark.png";
import TruckInfo from "@assets/app-images/markers/truck-info.png";
import TruckPrimary from "@assets/app-images/markers/truck-primary.png";
import TruckError from "@assets/app-images/markers/truck-error.png";
import TruckWarning from "@assets/app-images/markers/truck-warning.png";
import TruckGray from "@assets/app-images/markers/truck-gray.png";
import TruckDark from "@assets/app-images/markers/truck-dark.png";
import WarehouseInfo from "@assets/app-images/markers/warehouse-info.png";
import WarehousePrimary from "@assets/app-images/markers/warehouse-primary.png";
import WarehouseError from "@assets/app-images/markers/warehouse-error.png";
import WarehouseWarning from "@assets/app-images/markers/warehouse-warning.png";
import WarehouseGray from "@assets/app-images/markers/warehouse-gray.png";
import WarehouseDark from "@assets/app-images/markers/warehouse-dark.png";
import { colors } from "../../../theme";

export const images: Record<string, string> = {
  "bike-info": BikeInfo,
  "bike-primary": BikePrimary,
  "bike-error": BikeError,
  "bike-warning": BikeWarning,
  "bike-gray": BikeGray,
  "bike-dark": BikeDark,
  "car-info": CarInfo,
  "car-primary": CarPrimary,
  "car-error": CarError,
  "car-warning": CarWarning,
  "car-gray": CarGray,
  "car-dark": CarDark,
  "flag-info": FlagInfo,
  "flag-primary": FlagPrimary,
  "flag-error": FlagError,
  "flag-warning": FlagWarning,
  "flag-gray": FlagGray,
  "flag-dark": FlagDark,
  "person-info": PersonInfo,
  "person-primary": PersonPrimary,
  "person-error": PersonError,
  "person-warning": PersonWarning,
  "person-gray": PersonGray,
  "person-dark": PersonDark,
  "truck-info": TruckInfo,
  "truck-primary": TruckPrimary,
  "truck-error": TruckError,
  "truck-warning": TruckWarning,
  "truck-gray": TruckGray,
  "truck-dark": TruckDark,
  "warehouse-info": WarehouseInfo,
  "warehouse-primary": WarehousePrimary,
  "warehouse-error": WarehouseError,
  "warehouse-warning": WarehouseWarning,
  "warehouse-gray": WarehouseGray,
  "warehouse-dark": WarehouseDark,
};
export const iconNames: Record<string, string> = {
  bike: "bike",
  car: "car",
  flag: "flag",
  person: "person",
  truck: "truck",
  warehouse: "warehouse",
};
export const iconColors: Record<string, string> = {
  info: colors.info,
  primary: colors.primary,
  error: colors.error,
  warning: colors.warning,
  gray: colors.iconGray,
  dark: colors.titleText,
};
