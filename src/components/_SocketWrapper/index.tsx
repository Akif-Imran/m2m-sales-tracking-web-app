import { BASE_URL, events } from "@api";
import { useSocket } from "@hooks";
import { useAppDispatch, useAppSelector } from "@store";
import React from "react";

export const _SocketWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const server = useSocket(BASE_URL);
  const dispatch = useAppDispatch();
  const { data, error, isLoading } = useAppSelector((state) => state.companies);

  console.log(data, error, isLoading);

  React.useEffect(() => {
    if (!server) return;
    if (error !== null || isLoading) return;
    server.on(events.crash, (obj: { id: string }) => {
      console.log(obj);
      // dispatch(crash(obj));
    });

    return () => {
      server.off(events.crash);
    };
  }, [server, dispatch, error, isLoading]);

  return <React.Fragment>{children}</React.Fragment>;
};
