import { _SocketWrapper } from "@components";
import { useAuthContext } from "@contexts";
import { useAppDispatch } from "@store";
import {
  fetchAllCompanies,
  fetchAllContacts,
  fetchFollowUps,
  fetchProjectStatuses,
  fetchProjects,
  fetchSuppliers,
  fetchUserTypes,
  fetchUsers,
} from "@thunks";
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
    dispatch(fetchAllContacts(token));
    dispatch(fetchProjectStatuses(token));
    dispatch(fetchProjects(token));
    dispatch(fetchUsers(token));
    dispatch(fetchSuppliers(token));
    dispatch(fetchFollowUps(token));
  }, [dispatch, token]);

  return (
    <React.Fragment>
      {/* <_SocketWrapper>{children}</_SocketWrapper> */}
      {children}
    </React.Fragment>
  );
};
