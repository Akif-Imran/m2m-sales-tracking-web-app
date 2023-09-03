import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";

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
    addProject: (state, action: PayloadAction<Omit<IProject, "id">>) => {
      const id = Date.now();
      state.data.push({ id, ...action.payload });
    },
    updateProject: (state, action: PayloadAction<IProject>) => {
      const index = state.data.findIndex((contact) => contact.id === action.payload.id);
      state.data[index] = action.payload;
    },
    deleteProject: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((contact) => contact.id === action.payload);
      state.data.splice(index, 1);
    },
  },
});

export { projectSlice };
export const { addProject, deleteProject, updateProject } = projectSlice.actions;
export const projectReducer = projectSlice.reducer;
