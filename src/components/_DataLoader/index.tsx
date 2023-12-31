import { _SocketWrapper } from "@components";
import { useAuthContext } from "@contexts";
import { useAppDispatch } from "@store";
import {
  fetchAllCompanies,
  fetchClaim,
  fetchClaimStatuses,
  fetchContacts,
  fetchExpenseType,
  fetchFollowUps,
  fetchLeaveStatuses,
  fetchLeaves,
  fetchProjectStatuses,
  fetchProjects,
  fetchPurchaseCategory,
  fetchPurchaseRequestStatuses,
  fetchPurchaseRequests,
  fetchStock,
  fetchSuppliers,
  fetchTaskStatuses,
  fetchTasks,
  fetchUserTypes,
  fetchUsers,
  fetchWarehouse,
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
    dispatch(fetchContacts(token));
    dispatch(fetchProjectStatuses(token));
    dispatch(fetchProjects(token));
    dispatch(fetchUsers(token));
    dispatch(fetchSuppliers(token));
    dispatch(fetchFollowUps(token));
    dispatch(fetchClaim(token));
    dispatch(fetchClaimStatuses(token));
    dispatch(fetchPurchaseRequests(token));
    dispatch(fetchPurchaseRequestStatuses(token));
    dispatch(fetchLeaves(token));
    dispatch(fetchLeaveStatuses(token));
    dispatch(fetchTasks(token));
    dispatch(fetchTaskStatuses(token));
    dispatch(fetchExpenseType(token));
    dispatch(fetchPurchaseCategory(token));
    dispatch(fetchWarehouse(token));
    dispatch(fetchStock(token));
  }, [dispatch, token]);

  return (
    <React.Fragment>
      {/* <_SocketWrapper>{children}</_SocketWrapper> */}
      {children}
    </React.Fragment>
  );
};
