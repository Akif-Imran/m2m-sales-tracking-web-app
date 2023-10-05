import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: IProject[];
  isLoading: boolean;
  error: null | SerializedError;
}
type UpdateStatus = { projectId: number; statusId: number; statusName: string };

const initialState: State = {
  data: [
    {
      id: 1,
      companyId: 1,
      contractDate: "2023-10-05",
      deliveryDate: "2023-10-25",
      description: "description",
      name: "DATABASE_REMOTE_URL",
      projectType: "Sales",
      quotation: "IGJ8GWG2",
      salesPersonId: 2,
      statusId: 1,
      statusName: "Follow up added (10%)",
      value: {
        amount: 15000,
        currency: "MYR",
      },
    },
  ],
  isLoading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState: initialState,
  reducers: {
    addProject: (state, action: PayloadAction<Omit<IProject, "id">>) => {
      const id = Date.now();
      state.data.push({ id, ...action.payload });
    },
    updateProject: (state, action: PayloadAction<IProject>) => {
      const index = state.data.findIndex((contact) => contact.id === action.payload.id);
      state.data[index] = action.payload;
    },
    updateProjectStatus: (state, action: PayloadAction<UpdateStatus>) => {
      const index = state.data.findIndex((project) => project.id === action.payload.projectId);
      state.data[index].statusId = action.payload.statusId;
      state.data[index].statusName = action.payload.statusName;
    },
    deleteProject: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((contact) => contact.id === action.payload);
      state.data.splice(index, 1);
    },
  },
});

export { projectSlice };
export const { addProject, deleteProject, updateProject, updateProjectStatus } =
  projectSlice.actions;
export const projectReducer = projectSlice.reducer;
