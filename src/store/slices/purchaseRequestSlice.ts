import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: IPurchaseRequest[];
  isLoading: boolean;
  error: null | SerializedError;
}
type UpdateStatus = { purchaseRequestId: number; statusId: number; statusName: string };

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
      const id = Date.now();
      state.data.push({ id, ...action.payload });
    },
    updatePurchaseRequest: (state, action: PayloadAction<IPurchaseRequest>) => {
      const index = state.data.findIndex((contact) => contact.id === action.payload.id);
      state.data[index] = action.payload;
    },
    updatePurchaseRequestStatus: (state, action: PayloadAction<UpdateStatus>) => {
      const index = state.data.findIndex(
        (project) => project.id === action.payload.purchaseRequestId
      );
      state.data[index].statusId = action.payload.statusId;
      state.data[index].statusName = action.payload.statusName;
    },
    deletePurchaseRequest: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((contact) => contact.id === action.payload);
      state.data.splice(index, 1);
    },
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
