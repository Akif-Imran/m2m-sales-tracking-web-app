import { SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: ILeaveType[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [
    { id: 1, name: "Paid" },
    { id: 2, name: "Unpaid" },
  ],
  isLoading: false,
  error: null,
};

const leaveTypeSlice = createSlice({
  name: "leaveTypes",
  initialState: initialState,
  reducers: {},
});

export { leaveTypeSlice };
export const leaveTypeReducer = leaveTypeSlice.reducer;
