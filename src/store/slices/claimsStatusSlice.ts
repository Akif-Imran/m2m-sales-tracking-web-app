import { SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: IPurchaseRequestStatus[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [
    { id: 1, name: "Pending" },
    { id: 2, name: "Approved" },
    { id: 3, name: "Rejected" },
    { id: 4, name: "KIV" },
  ],
  isLoading: false,
  error: null,
};

const claimsStatusSlice = createSlice({
  name: "claimsStatusList",
  initialState: initialState,
  reducers: {},
});

export { claimsStatusSlice };
export const claimsStatusListReducer = claimsStatusSlice.reducer;
