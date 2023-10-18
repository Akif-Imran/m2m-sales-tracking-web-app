import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchLeaves } from "@thunks";

interface State {
  data: ILeaveApplication[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const leaveApplicationSlice = createSlice({
  name: "leaves",
  initialState: initialState,
  reducers: {
    addLeave: (state, action: PayloadAction<ILeaveApplication>) => {
      state.data.push(action.payload);
    },
    updateLeave: (state, action: PayloadAction<ILeaveApplication>) => {
      const index = state.data.findIndex((leave) => leave._id === action.payload._id);
      state.data[index] = action.payload;
    },
    updateLeaveStatus: (state, action: PayloadAction<ILeaveApplication>) => {
      const index = state.data.findIndex((leave) => leave._id === action.payload._id);
      state.data[index] = action.payload;
    },
    deleteLeave: (state, action: PayloadAction<string>) => {
      const index = state.data.findIndex((leave) => leave._id === action.payload);
      state.data.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLeaves.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchLeaves.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = true;
    });
    builder.addCase(fetchLeaves.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.error = null;
      state.isLoading = true;
    });
  },
});

export { leaveApplicationSlice as leaveSlice };
export const { addLeave, deleteLeave, updateLeave, updateLeaveStatus } =
  leaveApplicationSlice.actions;
export const leaveApplicationReducer = leaveApplicationSlice.reducer;
