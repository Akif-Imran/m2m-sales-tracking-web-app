import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchProjects } from "../thunks/projectThunks";

interface State {
  data: IProject[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState: initialState,
  reducers: {
    addProject: (state, action: PayloadAction<IProject>) => {
      state.data.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<IProject>) => {
      const index = state.data.findIndex((project) => project._id === action.payload._id);
      state.data[index] = action.payload;
    },
    updateProjectStatus: (state, action: PayloadAction<IProject>) => {
      const index = state.data.findIndex((project) => project._id === action.payload._id);
      state.data[index].status = action.payload.status;
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      const index = state.data.findIndex((contact) => contact._id === action.payload);
      state.data.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProjects.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchProjects.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.error = null;
      state.isLoading = false;
    });
  },
});

export { projectSlice };
export const { addProject, deleteProject, updateProject, updateProjectStatus } =
  projectSlice.actions;
export const projectReducer = projectSlice.reducer;
