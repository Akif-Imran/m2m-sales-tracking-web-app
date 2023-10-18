import { SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchLeaveStatuses } from "../thunks/leaveApplicationThunks";

interface State {
  data: ILeaveStatus[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const leaveStatusSlice = createSlice({
  name: "leaveStatusList",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLeaveStatuses.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchLeaveStatuses.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });
    builder.addCase(fetchLeaveStatuses.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data.filter((status) => status.id !== 4);
      }
      state.isLoading = false;
      state.error = null;
    });
  },
});

export { leaveStatusSlice };
export const leaveStatusReducer = leaveStatusSlice.reducer;
