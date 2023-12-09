const routes = {
  home: "/home",
  stock: {
    list: "/stock",
  },
  auth: {
    login: "/auth/login",
    forget_password: "/auth/forget_password",
    register: "/auth/register",
    verify_otp: "/auth/verify-otp",
  },
  dashboard: {
    crm: "/crm-dash",
    project: "/pm-dash",
    inventory: "/im-dash",
  },
  notification: {
    list: "/notifications",
  },
  company: {
    list: "/contacts",
    prospects: "/company-prospects/:companyId",
    prospect_nav: (companyId: string) => `/company-prospects/${companyId}`,
    projects: "/company-projects/:companyId",
    project_nav: (companyId: string) => `/company-projects/${companyId}`,
    details: "details/:companyId",
    details_nav: (companyId: string) => `details/${companyId}`,
  },

  reports: {
    list: "/reports/:companyId",
    list_nav: (companyId: string) => `/reports/${companyId}`,
    companies_report: "companies-report/:companyId",
    companies_report_nav: (companyId: string) => `companies-report/${companyId}`,
    task_report: "task-report/:companyId",
    task_report_nav: (companyId: string) => `task-report/${companyId}`,
    claims_report: "claims-report/:companyId",
    claims_report_nav: (companyId: string) => `claims-report/${companyId}`,
    project_performance_report: "project-performance-report/:companyId",
    project_performance_report_nav: (companyId: string) =>
      `project-performance-report/${companyId}`,
    team_performance_report: "team-performance-report/:companyId",
    team_performance_report_nav: (companyId: string) => `team-performance-report/${companyId}`,
    leaves_report: "leaves-report/:companyId",
    leaves_report_nav: (companyId: string) => `leaves-report/${companyId}`,
    purchase_request_report: "purchase-request-report/:companyId",
    purchase_request_report_nav: (companyId: string) => `purchase-request-report/${companyId}`,
  },

  projects: {
    list: "/projects",
    purchaseRequest: {
      list: "/purchase-requests",
    },
    claims: {
      list: "/claims",
    },
  },

  prospects: {
    list: "/prospects",
    followUps: {
      list: "/follow-ups",
    },
    claims: {
      list: "/claims",
    },
    details: "details/:projectId",
    details_nav: (projectId: string) => `details/${projectId}`,
  },
  user: {
    list: "/users",
    details: "details/:userId",
    details_nav: (userId: string) => `details/${userId}`,
    leaves: {
      list: "/leave-applications",
    },
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
    expense_type: "expense-type",
    purchase_category: "purchase-category",
    stock_items: "stock-items",
    suppliers: "suppliers",
  },
  help: {
    home: "/help",
  },
  contact_us: {
    home: "/contact-us",
  },
};
export { routes };
