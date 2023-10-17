import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchTasks } from "../thunks/taskThunks";

interface State {
  data: ITask[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState: initialState,
  reducers: {
    addTask: (state, action: PayloadAction<ITask>) => {
      state.data.push(action.payload);
    },
    modifyTask: (state, action: PayloadAction<ITask>) => {
      const index = state.data.findIndex((task) => task._id === action.payload._id);
      state.data[index] = action.payload;
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      const index = state.data.findIndex((task) => task._id === action.payload);
      state.data.splice(index, 1);
    },
    modifyTaskStatus: (state, action: PayloadAction<ITask>) => {
      const index = state.data.findIndex((task) => task._id === action.payload._id);
      state.data[index] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.error = null;
      state.isLoading = false;
    });
  },
});

export { taskSlice };
export const { addTask, deleteTask, modifyTask, modifyTaskStatus } = taskSlice.actions;
export const taskReducer = taskSlice.reducer;
