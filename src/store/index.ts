import { configureStore, createSelector } from "@reduxjs/toolkit";
import {
  claimsReducer,
  claimsStatusListReducer,
  companyContactReducer,
  companyReducer,
  departmentReducer,
  followUpReducer,
  projectReducer,
  projectStatusListReducer,
  purchaseRequestReducer,
  purchaseRequestStatusListReducer,
  supplierReducer,
  taskReducer,
  taskStatusListReducer,
  userReducer,
  userTypeReducer,
} from "@slices";
import { useSelector } from "react-redux";
import { TypedUseSelectorHook, useDispatch } from "react-redux";

const store = configureStore({
  reducer: {
    companyContacts: companyContactReducer,
    companies: companyReducer,
    departments: departmentReducer,
    projects: projectReducer,
    projectStatusList: projectStatusListReducer,
    followUps: followUpReducer,
    purchaseRequest: purchaseRequestReducer,
    purchaseRequestStatusList: purchaseRequestStatusListReducer,
    claims: claimsReducer,
    claimsStatusList: claimsStatusListReducer,
    tasks: taskReducer,
    taskStatusList: taskStatusListReducer,
    users: userReducer,
    userTypes: userTypeReducer,
    suppliers: supplierReducer,
  },
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

//selectors
export const selectCompanies = (state: RootState) => state.companies;
export const selectCompanyContact = (state: RootState) => state.companyContacts;
export const selectDepartments = (state: RootState) => state.departments;
export const selectProjects = (state: RootState) => state.projects;
export const selectProjectStatusList = (state: RootState) => state.projectStatusList;
export const selectFollowUps = (state: RootState) => state.followUps;
export const selectPurchaseRequests = (state: RootState) => state.purchaseRequest;
export const selectPurchaseRequestsStatusList = (state: RootState) =>
  state.purchaseRequestStatusList;
export const selectClaims = (state: RootState) => state.claims;
export const selectClaimsStatusList = (state: RootState) => state.claimsStatusList;

export const selectTasks = (state: RootState) => state.tasks;
export const selectTaskStatusList = (state: RootState) => state.taskStatusList;
export const selectUsers = (state: RootState) => state.users;
export const selectUserTypes = (state: RootState) => state.userTypes;
export const selectSuppliers = (state: RootState) => state.suppliers;

//memoized selectors
export const selectTasksCombined = createSelector(
  selectProjects,
  selectUsers,
  selectTasks,
  (projects, users, tasks) => {
    return {
      tasks: tasks.data.map((task) => {
        const project = projects.data.find((project) => project.id === task.projectId);
        const user = users.data.find((user) => user.id === task.assigneeId);
        return {
          ...task,
          project,
          assignee: user,
        };
      }),
    };
  }
);
export const selectUsersBasedOnType = createSelector(selectUsers, (users) => {
  return {
    engineers: users.data.filter((user) => user.userTypeName === "Engineer"),
    sales: users.data.filter((user) => user.userTypeName === "Sales"),
    admins: users.data.filter((user) => user.userTypeName === "Admin"),
  };
});
export const selectRecordsForDropdown = createSelector(
  selectCompanies,
  selectProjects,
  selectDepartments,
  selectUserTypes,
  selectUsers,
  selectProjectStatusList,
  selectTaskStatusList,
  selectPurchaseRequestsStatusList,
  selectSuppliers,
  selectClaimsStatusList,
  (
    companies,
    projects,
    departments,
    userTypes,
    users,
    projectStatus,
    taskStatus,
    purchaseRequestStatus,
    suppliers,
    claimsStatus
  ) => {
    return {
      companies: companies.data.map((company) => ({
        value: company.id.toString(),
        label: company.name,
      })),
      projects: projects.data.map((project) => ({
        value: project.id.toString(),
        label: project.name,
      })),
      suppliers: suppliers.data.map((supplier) => ({
        value: supplier.id.toString(),
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
      projectStatus: projectStatus.data.map((status) => ({
        value: status.id.toString(),
        label: status.name,
      })),
      taskStatus: taskStatus.data.map((status) => ({
        value: status.id.toString(),
        label: status.name,
      })),
      purchaseRequestStatus: purchaseRequestStatus.data.map((status) => ({
        value: status.id.toString(),
        label: status.name,
      })),
      claimsStatus: claimsStatus.data.map((status) => ({
        value: status.id.toString(),
        label: status.name,
      })),
      salesPersons: users.data
        .filter((user) => user.userTypeName === "Sales")
        .map((sales) => ({
          value: sales.id.toString(),
          label: `${sales.firstName} ${sales.lastName}`,
        })),
      projectManagers: users.data
        .filter((user) => user.userTypeName === "Engineer")
        .map((engineer) => ({
          value: engineer.id.toString(),
          label: `${engineer.firstName} ${engineer.lastName}`,
        })),
    };
  }
);
export const selectCompaniesWithContact = createSelector(
  selectCompanies,
  selectCompanyContact,
  (companies, contacts) => {
    return companies.data.map((company) => {
      const contact = contacts.data.find((contact) => contact.id === company.primaryContactId);
      return { ...company, contact };
    });
  }
);
export const selectProjectWithRecords = createSelector(
  selectProjects,
  selectCompanies,
  selectUsers,
  (projects, companies, users) => {
    return projects.data.map((project) => {
      const company = companies.data.find((company) => company.id === project.companyId);
      const salesPerson = users.data.find((user) => user.id === project.salesPersonId);
      return {
        ...project,
        company: company,
        salesPerson: salesPerson,
      };
    });
  }
);
export const selectFollowUpsWithRecords = createSelector(
  selectFollowUps,
  selectProjects,
  selectCompanyContact,
  selectUsers,
  (followups, projects, contacts, users) => {
    return followups.data.map((followup) => {
      const project = projects.data.find((project) => project.id === followup.projectId);
      const followUpPerson = users.data.find((user) => user.id === followup.followUpPersonId);
      const contactPerson = contacts.data.find(
        (contact) => contact.id === followup.contactPersonId
      );
      return { ...followup, project, contactPerson, followUpPerson };
    });
  }
);
export const selectPurchaseRequestsWithRecords = createSelector(
  selectPurchaseRequests,
  selectUsers,
  selectSuppliers,
  selectProjects,
  (requests, users, suppliers, projects) => {
    return requests.data.map((request) => {
      const requestByPerson = users.data.find((user) => user.id === request.requestedById);
      const project = projects.data.find((project) => project.id === request.projectId);
      const supplier = suppliers.data.find((supplier) => supplier.id === request.supplierId);
      return {
        ...request,
        requestByPerson,
        project,
        supplier,
      };
    });
  }
);
export const selectClaimsWithRecords = createSelector(
  selectClaims,
  selectUsers,
  selectSuppliers,
  selectProjects,
  (claims, users, suppliers, projects) => {
    return claims.data.map((request) => {
      const requestByPerson = users.data.find((user) => user.id === request.requestedById);
      const project = projects.data.find((project) => project.id === request.projectId);
      const supplier = suppliers.data.find((supplier) => supplier.id === request.supplierId);
      return {
        ...request,
        requestByPerson,
        project,
        supplier,
      };
    });
  }
);
