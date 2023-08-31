import RedCar from "../3d-car-top-view-red.png";
import WhiteCar from "../3d-car-top-view-white.png";
import BlueTruck from "../3d-truck-top-view-blue.png";
import Forklift from "../forklift.png";
import BikeRider from "../bike-rider.png";
import MarkerPin from "../marker-pin.png";
import RacingFlag from "../racing-flag.png";

interface IMapMarker {
  name: string;
  size: {
    width: number;
    height: number;
  };
  icon: string;
  offset: { x: number; y: number };
  rotate: number;
  anchor: { x: number; y: number };
  imageResizeMethod: "auto" | "scale" | "resize" | undefined;
  imageResizeMode: "contain" | "cover" | "stretch" | "repeat" | "center";
}

export const mapMarkers: Record<string, IMapMarker> = {
  "red-car-top": {
    name: "red-car-top",
    icon: RedCar,
    size: {
      width: 35,
      height: 35,
    },
    offset: { x: 0.0, y: 0.0 },
    anchor: { x: 0.2, y: 0.25 },
    rotate: 15,
    imageResizeMethod: "auto",
    imageResizeMode: "contain",
  },
  "white-car-top": {
    name: "white-car-top",
    icon: WhiteCar,
    size: {
      width: 32,
      height: 32,
    },
    offset: { x: 0.0, y: 0.0 },
    anchor: { x: 0.2, y: 0.25 },
    rotate: 15,
    imageResizeMethod: "auto",
    imageResizeMode: "contain",
  },
  "blue-truck-top": {
    name: "blue-truck-top",
    icon: BlueTruck,
    size: {
      width: 56,
      height: 56,
    },
    offset: { x: 0.0, y: 0.0 },
    anchor: { x: 0.2, y: 0.25 },
    rotate: 15,
    imageResizeMethod: "auto",
    imageResizeMode: "contain",
  },
  "forklift-side-left": {
    name: "forklift-side-left",
    icon: Forklift,
    size: {
      width: 32,
      height: 32,
    },
    offset: { x: 0.0, y: 0.0 },
    anchor: { x: 0.2, y: 0.25 },
    rotate: 15,
    imageResizeMethod: "auto",
    imageResizeMode: "contain",
  },
  "biker-rider-top": {
    name: "biker-rider-top",
    icon: BikeRider,
    size: {
      width: 32,
      height: 32,
    },
    offset: { x: 0.0, y: 0.0 },
    anchor: { x: 0.25, y: 0.25 },
    rotate: 15,
    imageResizeMethod: "auto",
    imageResizeMode: "contain",
  },
  "marker-pin": {
    name: "marker-pin",
    icon: MarkerPin,
    size: {
      width: 32,
      height: 32,
    },
    offset: { x: 0.0, y: 0.0 },
    anchor: { x: 0.2, y: 0.25 },
    rotate: 15,
    imageResizeMethod: "auto",
    imageResizeMode: "contain",
  },
  "racing-flag": {
    name: "racing-flag",
    icon: RacingFlag,
    size: {
      width: 32,
      height: 32,
    },
    offset: { x: 16, y: -14 },
    anchor: { x: 0.5, y: 1.0 },
    rotate: -70,
    imageResizeMethod: "auto",
    imageResizeMode: "contain",
  },
};
