import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchProjects, updateStatusProject } from "@thunks";

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
    modifyProject: (state, action: PayloadAction<IProject>) => {
      const index = state.data.findIndex((project) => project._id === action.payload._id);
      state.data[index] = action.payload;
    },
    modifyProjectStatus: (state, action: PayloadAction<IProject>) => {
      const index = state.data.findIndex((project) => project._id === action.payload._id);
      state.data[index].status = action.payload.status;
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      const index = state.data.findIndex((project) => project._id === action.payload);
      state.data.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateStatusProject.fulfilled, (state, action) => {
      if (action.payload.success) {
        const data = action.payload.data;
        if (data.status >= 4) {
          const index = state.data.findIndex((value) => value._id === data._id);
          if (index > -1) {
            state.data[index] = data;
          } else {
            state.data.push(data);
          }
        }
      }
    });

    builder.addCase(fetchProjects.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchProjects.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data.filter((value) => value.status >= 4);
      }
      state.error = null;
      state.isLoading = false;
    });
  },
});

export { projectSlice };
export const { addProject, deleteProject, modifyProject, modifyProjectStatus } =
  projectSlice.actions;
export const projectReducer = projectSlice.reducer;
