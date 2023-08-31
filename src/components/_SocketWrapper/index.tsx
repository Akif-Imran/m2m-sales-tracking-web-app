import { BASE_URL, events } from "@api";
import { useSocket } from "@hooks";
import {
  batterLow,
  batteryInfo,
  crash,
  idlingOff,
  idlingOn,
  ignitionOff,
  ignitionOn,
  mainPowerOff,
  mainPowerOn,
  virtualIgnitionOff,
  virtualIgnitionOn,
} from "@slices";
import { useAppDispatch, useAppSelector } from "@store";
import React from "react";

export const _SocketWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const server = useSocket(BASE_URL);
  const dispatch = useAppDispatch();
  const { data, error, isLoading } = useAppSelector((state) => state.devices);

  console.log(data, error, isLoading);

  React.useEffect(() => {
    if (!server) return;
    if (error !== null || isLoading) return;
    server.on(events.crash, (obj: ISocketNoMileageObj) => {
      console.log(obj);
      dispatch(crash(obj));
    });
    server.on(events.battery.info, (obj: ISocketBatteryObj) => {
      dispatch(batteryInfo(obj));
    });
    server.on(events.battery.low, (obj: ISocketBatteryObj<"low">) => {
      dispatch(batterLow(obj));
    });
    server.on(events.ignition.on, (obj: ISocketObj) => {
      console.log(obj);
      dispatch(ignitionOn(obj));
    });
    server.on(events.ignition.off, (obj: ISocketObj) => {
      console.log(obj);
      dispatch(ignitionOff(obj));
    });

    server.on(events.mainPower.on, (obj: ISocketNoMileageObj) => {
      console.log(obj);
      dispatch(mainPowerOn(obj));
    });
    server.on(events.mainPower.off, (obj: ISocketNoMileageObj) => {
      console.log(obj);
      dispatch(mainPowerOff(obj));
    });

    server.on(events.idling.on, (obj: ISocketObj) => {
      console.log(obj);
      dispatch(idlingOn(obj));
    });
    server.on(events.idling.off, (obj: ISocketObj) => {
      console.log(obj);
      dispatch(idlingOff(obj));
    });

    server.on(events.virtualIgnition.on, (obj: ISocketObj) => {
      console.log(obj);
      dispatch(virtualIgnitionOn(obj));
    });
    server.on(events.virtualIgnition.off, (obj: ISocketObj) => {
      console.log(obj);
      dispatch(virtualIgnitionOff(obj));
    });

    return () => {
      server.off(events.crash);
      server.off(events.battery.info);
      server.off(events.battery.low);
      server.off(events.ignition.on);
      server.off(events.ignition.off);
      server.off(events.mainPower.on);
      server.off(events.mainPower.off);
      server.off(events.virtualIgnition.on);
      server.off(events.virtualIgnition.off);
      server.off(events.idling.on);
      server.off(events.idling.off);
    };
  }, [server, dispatch, error, isLoading]);

  return <React.Fragment>{children}</React.Fragment>;
};
