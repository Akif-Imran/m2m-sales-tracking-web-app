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

const purchaseRequestStatusSlice = createSlice({
  name: "purchaseRequestStatusList",
  initialState: initialState,
  reducers: {},
});

export { purchaseRequestStatusSlice };
export const purchaseRequestStatusListReducer = purchaseRequestStatusSlice.reducer;
