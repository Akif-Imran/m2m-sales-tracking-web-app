import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: IClaim[];
  isLoading: boolean;
  error: null | SerializedError;
}
type UpdateStatus = { claimId: number; statusId: number; statusName: string };

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const claimsSlice = createSlice({
  name: "claims",
  initialState: initialState,
  reducers: {
    addClaim: (state, action: PayloadAction<Omit<IClaim, "id">>) => {
      const id = Date.now();
      state.data.push({ id, ...action.payload });
    },
    updateClaim: (state, action: PayloadAction<IClaim>) => {
      const index = state.data.findIndex((claim) => claim.id === action.payload.id);
      state.data[index] = action.payload;
    },
    updateClaimStatus: (state, action: PayloadAction<UpdateStatus>) => {
      const index = state.data.findIndex((claim) => claim.id === action.payload.claimId);
      state.data[index].statusId = action.payload.statusId;
      state.data[index].statusName = action.payload.statusName;
    },
    deleteClaim: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((claim) => claim.id === action.payload);
      state.data.splice(index, 1);
    },
  },
});

export { claimsSlice };
export const { addClaim, deleteClaim, updateClaim, updateClaimStatus } = claimsSlice.actions;
export const claimsReducer = claimsSlice.reducer;
