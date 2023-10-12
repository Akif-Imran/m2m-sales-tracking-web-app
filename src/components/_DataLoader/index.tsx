import { _SocketWrapper } from "@components";
import { useAuthContext } from "@contexts";
import { useAppDispatch } from "@store";
import { fetchAllCompanies, fetchUserTypes } from "@thunks";
import React from "react";

export const _DataLoader: React.FC<React.PropsWithChildren> = ({ children }) => {
  const {
    state: { token },
  } = useAuthContext();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (!token) {
      return;
    }
    dispatch(fetchAllCompanies(token));
    dispatch(fetchUserTypes(token));
  }, [dispatch, token]);

  return (
    <React.Fragment>
      {/* <_SocketWrapper>{children}</_SocketWrapper> */}
      {children}
    </React.Fragment>
  );
};
