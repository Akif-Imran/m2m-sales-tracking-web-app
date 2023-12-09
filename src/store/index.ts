import { configureStore, createSelector } from "@reduxjs/toolkit";
import {
  claimsReducer,
  claimsStatusListReducer,
  companyContactReducer,
  companyReducer,
  departmentReducer,
  expenseTypeReducer,
  followUpReducer,
  leaveApplicationReducer,
  leaveStatusReducer,
  leaveTypeReducer,
  leadReducer,
  projectStatusListReducer,
  purchaseCategoryReducer,
  purchaseRequestReducer,
  purchaseRequestStatusListReducer,
  stockItemReducer,
  stockItemStatusListReducer,
  supplierReducer,
  taskReducer,
  taskStatusListReducer,
  userReducer,
  userTypeReducer,
  projectReducer,
  moduleReducer,
} from "@slices";
import { useSelector } from "react-redux";
import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { notificationReducer } from "./slices/notificationsSlice";

const store = configureStore({
  reducer: {
    module: moduleReducer,
    companyContacts: companyContactReducer,
    companies: companyReducer,
    departments: departmentReducer,
    leads: leadReducer,
    projects: projectReducer,
    projectStatusList: projectStatusListReducer,
    followUps: followUpReducer,
    purchaseRequest: purchaseRequestReducer,
    purchaseRequestStatusList: purchaseRequestStatusListReducer,
    purchaseCategories: purchaseCategoryReducer,
    claims: claimsReducer,
    claimsStatusList: claimsStatusListReducer,
    expenseTypeList: expenseTypeReducer,
    tasks: taskReducer,
    taskStatusList: taskStatusListReducer,
    users: userReducer,
    userTypes: userTypeReducer,
    leaves: leaveApplicationReducer,
    leaveStatusList: leaveStatusReducer,
    leaveTypes: leaveTypeReducer,
    stockItems: stockItemReducer,
    stockItemStatusList: stockItemStatusListReducer,
    suppliers: supplierReducer,
    notifications: notificationReducer,
  },
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

//selectors
export const selectModule = (state: RootState) => state.module;
export const selectCompanies = (state: RootState) => state.companies;
export const selectCompanyContact = (state: RootState) => state.companyContacts;
export const selectDepartments = (state: RootState) => state.departments;
export const selectLeads = (state: RootState) => state.leads;
export const selectProjects = (state: RootState) => state.projects;
export const selectProjectStatusList = (state: RootState) => state.projectStatusList;
export const selectFollowUps = (state: RootState) => state.followUps;
export const selectPurchaseRequests = (state: RootState) => state.purchaseRequest;
export const selectPurchaseRequestsStatusList = (state: RootState) =>
  state.purchaseRequestStatusList;
export const selectPurchaseCategories = (state: RootState) => state.purchaseCategories;
export const selectClaims = (state: RootState) => state.claims;
export const selectClaimsStatusList = (state: RootState) => state.claimsStatusList;
export const selectExpenseTypeList = (state: RootState) => state.expenseTypeList;
export const selectTasks = (state: RootState) => state.tasks;
export const selectTaskStatusList = (state: RootState) => state.taskStatusList;
export const selectUsers = (state: RootState) => state.users;
export const selectUserTypes = (state: RootState) => state.userTypes;
export const selectLeaves = (state: RootState) => state.leaves;
export const selectLeaveStatusList = (state: RootState) => state.leaveStatusList;
export const selectLeaveTypes = (state: RootState) => state.leaveTypes;
export const selectStockItems = (state: RootState) => state.stockItems;
export const selectStockItemsStatusList = (state: RootState) => state.stockItemStatusList;
export const selectSuppliers = (state: RootState) => state.suppliers;
export const selectNotifications = (state: RootState) => state.notifications;

//memoized selectors
export const selectTasksCombined = createSelector(
  selectLeads,
  selectProjects,
  selectUsers,
  selectTasks,
  selectCompanies,
  selectTaskStatusList,
  (leads, projects, users, tasks, companies, statuses) => {
    return {
      tasks: tasks.data.map((task) => {
        const project = leads.data
          .concat(projects.data)
          .find((project) => project._id === task.projectId);
        const user = users.data.find((user) => user._id === task.assignedTo);
        const company = companies.data.find((company) => company._id === task.customerId);
        const statusName = statuses.data.find((status) => status.id === task.status)?.name;
        return {
          ...task,
          project,
          assignee: user,
          company,
          statusName,
        };
      }),
    };
  }
);

export const selectUsersBasedOnType = createSelector(selectUsers, (users) => {
  return {
    engineers: users.data.filter((user) => user.userType === 3),
    sales: users.data.filter((user) => user.userType === 2),
    admins: users.data.filter((user) => user.userType === 1),
  };
});

export const selectRecordsForDropdown = createSelector(
  selectCompanies,
  selectLeads,
  selectProjects,
  selectDepartments,
  selectUserTypes,
  selectUsers,
  selectProjectStatusList,
  selectTaskStatusList,
  selectPurchaseRequestsStatusList,
  selectSuppliers,
  selectClaimsStatusList,
  selectLeaveStatusList,
  selectLeaveTypes,
  selectExpenseTypeList,
  selectPurchaseCategories,
  selectStockItemsStatusList,
  (
    companies,
    leads,
    projects,
    departments,
    userTypes,
    users,
    projectStatus,
    taskStatus,
    purchaseRequestStatus,
    suppliers,
    claimsStatus,
    leaveStatus,
    leaveTypes,
    expenseTypes,
    purchaseCategories,
    stockItemStatus
  ) => {
    return {
      companies: companies.data.map((company) => ({
        value: company._id,
        label: company.name,
      })),
      leads: leads.data.map((lead) => ({
        value: lead._id,
        label: lead.name,
      })),
      projects: projects.data.map((project) => ({
        value: project._id,
        label: project.name,
      })),
      suppliers: suppliers.data.map((supplier) => ({
        value: supplier._id,
        label: supplier.name,
      })),
      departments: departments.data.map((department) => ({
        value: department.id.toString(),
        label: department.name,
      })),
      userTypes: userTypes.data.map((userType) => ({
        value: userType.id.toString(),
        label: userType.name,
      })),
      projectStatus: projectStatus.data
        .filter((value) => value.id >= 4)
        .map((status) => ({
          value: status.id.toString(),
          label: `${status.name} (${status.value}%)`,
        })),
      leadStatus: projectStatus.data
        .filter((value) => value.id < 4)
        .map((status) => ({
          value: status.id.toString(),
          label: `${status.name} (${status.value}%)`,
        })),
      taskStatus: taskStatus.data.map((status) => ({
        value: status.id.toString(),
        label: status.name,
      })),
      purchaseRequestStatus: purchaseRequestStatus.data.map((status) => ({
        value: status.id.toString(),
        label: status.name,
      })),
      stockItemStatus: stockItemStatus.data.map((status) => ({
        value: status.id.toString(),
        label: status.name,
      })),
      claimsStatus: claimsStatus.data.map((status) => ({
        value: status.id.toString(),
        label: status.name,
      })),
      expenseTypes: expenseTypes.data.map((type) => ({
        value: type._id,
        label: type.name,
      })),
      purchaseCategories: purchaseCategories.data.map((category) => ({
        value: category._id,
        label: category.name,
      })),
      leaveStatus: leaveStatus.data.map((status) => ({
        value: status.id.toString(),
        label: status.name,
      })),
      leaveTypes: leaveTypes.data.map((type) => ({
        value: type.name,
        label: type.name,
      })),
      salesPersons: users.data
        .filter((user) => user.userType === 2)
        .map((sales) => ({
          value: sales._id,
          label: `${sales.name}`,
        })),
      engineers: users.data
        .filter((user) => user.userType === 3)
        .map((engineer) => ({
          value: engineer._id,
          label: `${engineer.name}`,
        })),
    };
  }
);

export const selectLeadsWithRecords = createSelector(
  selectLeads,
  selectCompanies,
  selectUsers,
  selectProjectStatusList,
  (projects, companies, users, statuses) => {
    return projects.data.map((project) => {
      const company = companies.data.find((company) => company._id === project.customerId);
      const salesPerson = users.data.find((user) => user._id === project.salesPerson);
      const engineer = users.data.find((user) => user._id === project?.engineer);
      const status = statuses.data.find((status) => status.id === project.status);
      return {
        ...project,
        company: company,
        salesPersonValue: salesPerson,
        engineerValue: engineer,
        statusName: `${status?.name} (${status?.value}%)`,
        completionPercentage: status?.value,
      };
    });
  }
);

export const selectProjectsWithRecords = createSelector(
  selectProjects,
  selectCompanies,
  selectUsers,
  selectProjectStatusList,
  (projects, companies, users, statuses) => {
    return projects.data.map((project) => {
      const company = companies.data.find((company) => company._id === project.customerId);
      const salesPerson = users.data.find((user) => user._id === project.salesPerson);
      const engineer = users.data.find((user) => user._id === project?.engineer);
      const status = statuses.data.find((status) => status.id === project.status);
      return {
        ...project,
        company: company,
        salesPersonValue: salesPerson,
        engineerValue: engineer,
        statusName: `${status?.name} (${status?.value}%)`,
        completionPercentage: status?.value,
      };
    });
  }
);

export const selectFollowUpsWithRecords = createSelector(
  selectFollowUps,
  selectLeads,
  selectCompanyContact,
  selectUsers,
  selectExpenseTypeList,
  (followups, leads, contacts, users, expenseTypes) => {
    return followups.data.map((followup) => {
      const lead = leads.data.find((project) => project._id === followup.projectId);
      const followUpPerson = users.data.find((user) => user._id === followup.createdBy);
      const contactPerson = contacts.data.find((contact) => contact._id === followup.contactId);
      const expenseType = expenseTypes.data.find((type) => type._id === followup?.expenseType);
      return {
        ...followup,
        lead: lead,
        contactPerson,
        followUpPerson,
        expenseTypeDetail: expenseType,
      };
    });
  }
);

export const selectPurchaseRequestsWithRecords = createSelector(
  selectPurchaseRequests,
  selectUsers,
  selectSuppliers,
  selectProjects,
  selectPurchaseRequestsStatusList,
  selectPurchaseCategories,
  (requests, users, suppliers, projects, statuses, categories) => {
    return requests.data.map((request) => {
      const requestByPerson = users.data.find((user) => user._id === request.createdBy);
      const project = projects.data.find((project) => project._id === request.projectId);
      const supplier = suppliers.data.find((supplier) => supplier._id === request.supplierId);
      const statusName = statuses.data.find((status) => status.id === request.status)?.name;
      const category = categories.data.find((category) => category._id === request.categoryId);
      return {
        ...request,
        requestByPerson,
        project,
        supplier,
        statusName,
        category,
      };
    });
  }
);
export const selectClaimsWithRecords = createSelector(
  selectClaims,
  selectUsers,
  selectSuppliers,
  selectLeads,
  selectProjects,
  selectClaimsStatusList,
  (claims, users, suppliers, leads, projects, statuses) => {
    return claims.data.map((request) => {
      const requestByPerson = users.data.find((user) => user._id === request.createdBy);
      const lead = leads.data
        .concat(projects.data)
        .find((project) => project._id === request.projectId);
      const supplier = suppliers.data.find((supplier) => supplier._id === request.supplierId);
      const statusName = statuses.data.find((status) => status.id === request.status)?.name;
      return {
        ...request,
        requestByPerson,
        lead,
        supplier,
        statusName,
      };
    });
  }
);

export const selectUserWithRecords = createSelector(
  selectUsers,
  selectUserTypes,
  (users, types) => {
    return users.data.map((user) => {
      const userType = types.data.find((type) => type.id === user.userType);
      return { ...user, userTypeName: userType?.name };
    });
  }
);

export const selectLeavesWithRecords = createSelector(
  selectUsers,
  selectLeaves,
  selectLeaveStatusList,
  (users, leaves, statuses) => {
    return leaves.data.map((leave) => {
      const requestByPerson = users.data.find((user) => user._id === leave.createdBy);
      const statusName = statuses.data.find((status) => status.id === leave.status)?.name;
      return {
        ...leave,
        requestByPerson,
        statusName,
      };
    });
  }
);

export const selectStockItemsWithRecords = createSelector(
  selectStockItems,
  selectStockItemsStatusList,
  selectUsers,
  (item, statuses, users) => {
    return item.data.map((item) => {
      const statusName = statuses.data.find((status) => status.id === item.status)?.name;
      const requestByPerson = users.data.find((user) => user._id === item.createdBy);
      const assignee = users.data.find((user) => user._id === item.assignedTo);
      return {
        ...item,
        statusName,
        requestByPerson,
        assignee,
      };
    });
  }
);
