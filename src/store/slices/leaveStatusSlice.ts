import { SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: ILeaveStatus[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [
    { id: 1, name: "Pending" },
    { id: 2, name: "Approved" },
    { id: 3, name: "Rejected" },
  ],
  isLoading: false,
  error: null,
};

const leaveStatusSlice = createSlice({
  name: "leaveStatusList",
  initialState: initialState,
  reducers: {},
});

export { leaveStatusSlice };
export const leaveStatusReducer = leaveStatusSlice.reducer;
