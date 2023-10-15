import { SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchPurchaseRequestStatuses } from "@thunks";

interface State {
  data: IPurchaseRequestStatus[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const purchaseRequestStatusSlice = createSlice({
  name: "purchaseRequestStatusList",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPurchaseRequestStatuses.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchPurchaseRequestStatuses.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(fetchPurchaseRequestStatuses.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.error = null;
      state.isLoading = false;
    });
  },
});

export { purchaseRequestStatusSlice };
export const purchaseRequestStatusListReducer = purchaseRequestStatusSlice.reducer;
