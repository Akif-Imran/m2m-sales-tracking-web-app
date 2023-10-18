import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchPurchaseRequests } from "../thunks/purchaseRequestThunks";

interface State {
  data: IPurchaseRequest[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const purchaseRequestSlice = createSlice({
  name: "purchaseRequest",
  initialState: initialState,
  reducers: {
    addPurchaseRequest: (state, action: PayloadAction<Omit<IPurchaseRequest, "id">>) => {
      console.log("addPurchaseRequest payload", action.payload);
      state.data.push(action.payload);
    },
    updatePurchaseRequest: (state, action: PayloadAction<IPurchaseRequest>) => {
      const index = state.data.findIndex((request) => request._id === action.payload._id);
      state.data[index] = action.payload;
    },
    updatePurchaseRequestStatus: (state, action: PayloadAction<IPurchaseRequest>) => {
      const index = state.data.findIndex((request) => request._id === action.payload._id);
      state.data[index] = action.payload;
    },
    deletePurchaseRequest: (state, action: PayloadAction<string>) => {
      const index = state.data.findIndex((contact) => contact._id === action.payload);
      state.data.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPurchaseRequests.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchPurchaseRequests.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(fetchPurchaseRequests.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.error = null;
      state.isLoading = false;
    });
  },
});

export { purchaseRequestSlice };
export const {
  addPurchaseRequest,
  deletePurchaseRequest,
  updatePurchaseRequest,
  updatePurchaseRequestStatus,
} = purchaseRequestSlice.actions;
export const purchaseRequestReducer = purchaseRequestSlice.reducer;
