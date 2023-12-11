import { _AppShell, _RequireAuth, _SocketWrapper } from "@components";
import {
  CRMDash,
  ProjectDash,
  InventoryDash,
  Error404,
  ForgotPassword,
  Login,
  Register,
  _VerifyOTP,
  Settings,
  Company,
  Leads,
  FollowUps,
  PurchaseRequests,
  Claims,
  Tasks,
  Users,
  Reports,
  Projects,
  Home,
  Stock,
} from "@pages";
import { routes } from "./routes";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import TopBarProgress from "react-topbar-progress-indicator";
import React from "react";

interface OwnProps {}
const MainApp: React.FC<OwnProps> = () => {
  //company
  const _CompanyProspects = lazy(() => import("../pages/companies/company-prospects"));
  const _CompanyProjects = lazy(() => import("../pages/companies/company-projects"));
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
  const _PurchaseCategories = lazy(() => import("../pages/settings/purchase-req-category"));
  const _Warehouse = lazy(() => import("../pages/settings/warehouse"));
  //notifications
  const _Notification = lazy(() => import("../pages/notification"));
  //help
  const _Help = lazy(() => import("../pages/help"));
  //about
  const _ContactUs = lazy(() => import("../pages/contact-us"));

  return (
    <Routes>
      <Route path="/" element={<Navigate to={routes.home} />} />
      <Route path={routes.auth.login} element={<Login />} />
      <Route path={routes.auth.register} element={<Register />} />
      <Route path={routes.auth.forget_password} element={<ForgotPassword />} />
      <Route path={routes.auth.verify_otp} element={<_VerifyOTP />} />

      <Route
        path={routes.home}
        element={<_RequireAuth children={<_AppShell page={<Home />} />} />}
      />

      {/* dashboard */}
      <Route
        path={routes.dashboard.crm}
        element={<_RequireAuth children={<_AppShell page={<CRMDash />} />} />}
      />
      <Route
        path={routes.dashboard.project}
        element={<_RequireAuth children={<_AppShell page={<ProjectDash />} />} />}
      />
      <Route
        path={routes.dashboard.inventory}
        element={<_RequireAuth children={<_AppShell page={<InventoryDash />} />} />}
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
        path={routes.company.prospects}
        element={
          <_RequireAuth
            children={<_AppShell page={<SuspendedView children={<_CompanyProspects />} />} />}
          />
        }
      />
      <Route
        path={routes.company.projects}
        element={
          <_RequireAuth
            children={<_AppShell page={<SuspendedView children={<_CompanyProjects />} />} />}
          />
        }
      />

      {/* projects */}
      <Route
        path={routes.projects.list}
        element={<_RequireAuth children={<_AppShell page={<Projects />} />} />}
      ></Route>

      {/* purchase requests  */}
      <Route
        path={routes.projects.purchaseRequest.list}
        element={<_RequireAuth children={<_AppShell page={<PurchaseRequests />} />} />}
      ></Route>

      {/* leads */}
      <Route
        path={routes.prospects.list}
        element={<_RequireAuth children={<_AppShell page={<Leads />} />} />}
      ></Route>

      {/* follow ups */}
      <Route
        path={routes.prospects.followUps.list}
        element={<_RequireAuth children={<_AppShell page={<FollowUps />} />} />}
      ></Route>

      {/* claims */}
      <Route
        path={routes.prospects.claims.list}
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

      {/* Stock */}
      <Route
        path={routes.stock.list}
        element={<_RequireAuth children={<_AppShell page={<Stock />} />} />}
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
        <Route
          path={routes.settings.purchase_category}
          element={<SuspendedView children={<_PurchaseCategories />} />}
        />
        <Route
          path={routes.settings.warehouse}
          element={<SuspendedView children={<_Warehouse />} />}
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
        path={routes.contact_us.home}
        element={
          <_RequireAuth
            children={<_AppShell page={<SuspendedView children={<_ContactUs />} />} />}
          />
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
