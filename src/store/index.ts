import { configureStore, createSelector } from "@reduxjs/toolkit";
import {
  companyContactReducer,
  companyReducer,
  departmentReducer,
  projectReducer,
  projectStatusListReducer,
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
    taskStatusList: taskStatusListReducer,
    users: userReducer,
    userTypes: userTypeReducer,
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
export const selectTaskStatusList = (state: RootState) => state.taskStatusList;
export const selectUsers = (state: RootState) => state.users;
export const selectUserTypes = (state: RootState) => state.userTypes;

//memoized selectors
export const selectUsersBasedOnType = createSelector(selectUsers, (users) => {
  return {
    engineers: users.data.filter((user) => user.userTypeName === "Engineer"),
    sales: users.data.filter((user) => user.userTypeName === "Sales"),
    admins: users.data.filter((user) => user.userTypeName === "Admin"),
  };
});
export const selectRecordsForDropdown = createSelector(
  selectCompanies,
  selectDepartments,
  selectUserTypes,
  selectUsers,
  selectProjectStatusList,
  selectTaskStatusList,
  (companies, departments, userTypes, users, projectStatus, taskStatus) => {
    return {
      companies: companies.data.map((company) => ({
        value: company.id.toString(),
        label: company.name,
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
