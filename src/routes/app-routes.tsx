import { _AppShell, _RequireAuth, _SocketWrapper } from "@components";
import {
  Dashboard,
  Error404,
  ForgotPassword,
  Login,
  Register,
  _VerifyOTP,
  Settings,
  Company,
  Projects,
  Tasks,
  Users,
} from "@pages";
import { routes } from "./routes";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import TopBarProgress from "react-topbar-progress-indicator";
import React from "react";

interface OwnProps {}
const MainApp: React.FC<OwnProps> = () => {
  //company
  //projects
  //task
  //users
  //settings
  const _ChangePassword = lazy(() => import("../pages/settings/change-password"));
  const _AppTheme = lazy(() => import("../pages/settings/app-theme"));
  //notifications
  const _Notification = lazy(() => import("../pages/notification"));
  //help
  const _Help = lazy(() => import("../pages/help"));
  //about
  const _About = lazy(() => import("../pages/about"));

  return (
    <Routes>
      <Route path="/" element={<Navigate to={routes.dashboard.home} />} />
      <Route path={routes.auth.login} element={<Login />} />
      <Route path={routes.auth.register} element={<Register />} />
      <Route path={routes.auth.forget_password} element={<ForgotPassword />} />
      <Route path={routes.auth.verify_otp} element={<_VerifyOTP />} />
      <Route
        path={routes.dashboard.home}
        element={<_RequireAuth children={<_AppShell page={<Dashboard />} />} />}
      />

      {/* notification */}
      <Route
        path={routes.notification.list}
        element={
          <SuspendedView
            children={<_RequireAuth children={<_AppShell page={<_Notification />} />} />}
          />
        }
      />

      {/* company */}
      <Route
        path={routes.company.list}
        element={<_RequireAuth children={<_AppShell page={<Company />} />} />}
      />

      {/* projects */}
      <Route
        path={routes.project.list}
        element={<_RequireAuth children={<_AppShell page={<Projects />} />} />}
      ></Route>

      {/* task */}
      <Route
        path={routes.task.list}
        element={<_RequireAuth children={<_AppShell page={<Tasks />} />} />}
      ></Route>

      {/* users */}
      <Route
        path={routes.user.list}
        element={<_RequireAuth children={<_AppShell page={<Users />} />} />}
      ></Route>

      {/* settings */}
      <Route
        path={routes.settings.home}
        element={<_RequireAuth children={<_AppShell page={<Settings />} />} />}
      >
        <Route
          path={routes.settings.change_password}
          element={<SuspendedView children={<_ChangePassword />} />}
        />
        <Route
          path={routes.settings.app_theme}
          element={<SuspendedView children={<_AppTheme />} />}
        />
      </Route>

      {/* help */}
      <Route
        path={routes.help.home}
        element={
          <_RequireAuth children={<_AppShell page={<SuspendedView children={<_Help />} />} />} />
        }
      />
      {/* home */}
      <Route
        path={routes.about.home}
        element={
          <_RequireAuth children={<_AppShell page={<SuspendedView children={<_About />} />} />} />
        }
      />
      {/* error */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

const SuspendedView: React.FC<React.PropsWithChildren> = ({ children }) => {
  TopBarProgress.config({
    barThickness: 2,
    shadowBlur: 5,
  });

  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export { MainApp };
