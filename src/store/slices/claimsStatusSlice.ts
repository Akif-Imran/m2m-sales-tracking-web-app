import { SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchClaimStatuses } from "@thunks";

interface State {
  data: IClaimStatus[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  //TODO - status list should have pending state as well and that would be the default state when claim is created
  isLoading: false,
  error: null,
};

const claimsStatusSlice = createSlice({
  name: "claimsStatusList",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchClaimStatuses.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchClaimStatuses.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(fetchClaimStatuses.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.error = null;
      state.isLoading = false;
    });
  },
});

export { claimsStatusSlice };
export const claimsStatusListReducer = claimsStatusSlice.reducer;
