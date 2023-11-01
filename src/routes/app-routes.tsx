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
  FollowUps,
  PurchaseRequests,
  Claims,
  Tasks,
  Users,
  Reports,
} from "@pages";
import { routes } from "./routes";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import TopBarProgress from "react-topbar-progress-indicator";
import React from "react";

interface OwnProps {}
const MainApp: React.FC<OwnProps> = () => {
  //company
  const _CompanyProject = lazy(() => import("../pages/companies/company-projects"));
  //projects
  //task
  //reports
  const _CompaniesReport = lazy(() => import("../pages/reports/companies-report"));
  const _ClaimsReport = lazy(() => import("../pages/reports/claims-report"));
  const _TasksReport = lazy(() => import("../pages/reports/tasks-report"));
  const _ProjectPerformanceReport = lazy(
    () => import("../pages/reports/project-performance-report")
  );
  const _TeamPerformanceReport = lazy(() => import("../pages/reports/team-performance-report"));
  const _LeavesReport = lazy(() => import("../pages/reports/leaves-report"));
  const _PurchaseRequestReport = lazy(() => import("../pages/reports/purchase-request-report"));

  //users
  const _LeaveApplications = lazy(() => import("../pages/users/leaves/home"));
  //settings
  const _ChangePassword = lazy(() => import("../pages/settings/change-password"));
  const _AppTheme = lazy(() => import("../pages/settings/app-theme"));
  const _Suppliers = lazy(() => import("../pages/settings/suppliers"));
  const _ExpenseTypes = lazy(() => import("../pages/settings/expense-type"));
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
      <Route
        path={routes.company.project}
        element={
          <_RequireAuth
            children={<_AppShell page={<SuspendedView children={<_CompanyProject />} />} />}
          />
        }
      />

      {/* projects */}
      <Route
        path={routes.project.list}
        element={<_RequireAuth children={<_AppShell page={<Projects />} />} />}
      ></Route>

      {/* follow ups */}
      <Route
        path={routes.project.followUps.list}
        element={<_RequireAuth children={<_AppShell page={<FollowUps />} />} />}
      ></Route>

      {/* purchase requests  */}
      <Route
        path={routes.project.purchaseRequest.list}
        element={<_RequireAuth children={<_AppShell page={<PurchaseRequests />} />} />}
      ></Route>

      {/* claims */}
      <Route
        path={routes.project.claims.list}
        element={<_RequireAuth children={<_AppShell page={<Claims />} />} />}
      ></Route>

      {/* task */}
      <Route
        path={routes.task.list}
        element={<_RequireAuth children={<_AppShell page={<Tasks />} />} />}
      ></Route>
      <Route
        path={routes.reports.list}
        element={<_RequireAuth children={<_AppShell page={<Reports />} />} />}
      >
        <Route
          path={routes.reports.companies_report}
          element={<SuspendedView children={<_CompaniesReport />} />}
        />
        <Route
          path={routes.reports.claims_report}
          element={<SuspendedView children={<_ClaimsReport />} />}
        />
        <Route
          path={routes.reports.task_report}
          element={<SuspendedView children={<_TasksReport />} />}
        />
        <Route
          path={routes.reports.project_performance_report}
          element={<SuspendedView children={<_ProjectPerformanceReport />} />}
        />
        <Route
          path={routes.reports.team_performance_report}
          element={<SuspendedView children={<_TeamPerformanceReport />} />}
        />
        <Route
          path={routes.reports.leaves_report}
          element={<SuspendedView children={<_LeavesReport />} />}
        />
        <Route
          path={routes.reports.purchase_request_report}
          element={<SuspendedView children={<_PurchaseRequestReport />} />}
        />
      </Route>

      {/* users */}
      <Route
        path={routes.user.list}
        element={<_RequireAuth children={<_AppShell page={<Users />} />} />}
      ></Route>

      {/* users */}
      <Route
        path={routes.user.leaves.list}
        element={
          <_RequireAuth
            children={
              <_AppShell
                page={
                  <SuspendedView>
                    <_LeaveApplications />
                  </SuspendedView>
                }
              />
            }
          />
        }
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
        <Route
          path={routes.settings.suppliers}
          element={<SuspendedView children={<_Suppliers />} />}
        />
        <Route
          path={routes.settings.expense_type}
          element={<SuspendedView children={<_ExpenseTypes />} />}
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
