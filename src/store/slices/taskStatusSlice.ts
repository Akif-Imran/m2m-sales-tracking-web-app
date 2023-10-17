import { SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchTaskStatuses } from "../thunks/taskThunks";

interface State {
  data: ITaskStatus[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const taskStatusSlice = createSlice({
  name: "taskStatusList",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTaskStatuses.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchTaskStatuses.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(fetchTaskStatuses.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.error = null;
      state.isLoading = false;
    });
  },
});

export { taskStatusSlice };
export const taskStatusListReducer = taskStatusSlice.reducer;
