import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchClaim } from "@thunks";

interface State {
  data: IClaim[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const claimsSlice = createSlice({
  name: "claims",
  initialState: initialState,
  reducers: {
    addClaim: (state, action: PayloadAction<IClaim>) => {
      console.log("addClaim payload", action.payload);
      state.data.push(action.payload);
    },
    modifyClaim: (state, action: PayloadAction<IClaim>) => {
      const index = state.data.findIndex((claim) => claim._id === action.payload._id);
      state.data[index] = action.payload;
    },
    updateClaimStatus: (state, action: PayloadAction<IClaim>) => {
      const index = state.data.findIndex((claim) => claim._id === action.payload._id);
      state.data[index].status = action.payload.status;
    },
    deleteClaim: (state, action: PayloadAction<string>) => {
      const index = state.data.findIndex((claim) => claim._id === action.payload);
      state.data.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchClaim.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchClaim.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(fetchClaim.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.error = null;
      state.isLoading = false;
    });
  },
});

export { claimsSlice };
export const { addClaim, deleteClaim, modifyClaim, updateClaimStatus } = claimsSlice.actions;
export const claimsReducer = claimsSlice.reducer;
