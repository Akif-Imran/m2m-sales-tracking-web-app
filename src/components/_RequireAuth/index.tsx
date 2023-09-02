import React, { PropsWithChildren } from "react";
import { useAuthContext } from "@contexts";
import { Navigate, useLocation } from "react-router-dom";
import { routes } from "@routes";

export const _RequireAuth: React.FC<PropsWithChildren> = ({ children }) => {
  const {
    state: { isAuthorized },
  } = useAuthContext();
  const location = useLocation();
  if (!isAuthorized) {
    return <Navigate to={routes.auth.login} state={{ path: location.pathname }} />;
  }

  return <>{children}</>;
};
