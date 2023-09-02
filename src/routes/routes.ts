const routes = {
  auth: {
    login: "/auth/login",
    forget_password: "/auth/forget_password",
    register: "/auth/register",
    verify_otp: "/auth/verify-otp",
  },
  dashboard: {
    home: "/dashboard",
  },
  notification: {
    list: "/notifications",
  },
  company: {
    list: "/companies",
    details: "details/:companyId",
    details_nav: (companyId: string) => `details/${companyId}`,
  },
  project: {
    list: "/projects",
    details: "details/:projectId",
    details_nav: (projectId: string) => `details/${projectId}`,
  },
  user: {
    list: "/users",
    details: "details/:userId",
    details_nav: (userId: string) => `details/${userId}`,
  },
  task: {
    list: "/tasks",
    details: "details/:taskId",
    details_nav: (taskId: string) => `details/${taskId}`,
  },
  settings: {
    home: "/settings",
    change_password: "change-password",
    app_theme: "app-theme",
  },
  help: {
    home: "/help",
  },
  about: {
    home: "/about",
  },
};
export { routes };
