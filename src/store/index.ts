import { configureStore, createSelector } from "@reduxjs/toolkit";
import {
  companyContactReducer,
  companyReducer,
  departmentReducer,
  projectReducer,
  projectStatusListReducer,
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
    tasks: taskReducer,
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
export const selectTasks = (state: RootState) => state.tasks;
export const selectTaskStatusList = (state: RootState) => state.taskStatusList;
export const selectUsers = (state: RootState) => state.users;
export const selectUserTypes = (state: RootState) => state.userTypes;

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
  (companies, projects, departments, userTypes, users, projectStatus, taskStatus) => {
    return {
      companies: companies.data.map((company) => ({
        value: company.id.toString(),
        label: company.name,
      })),
      projects: projects.data.map((project) => ({
        value: project.id.toString(),
        label: project.name,
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
