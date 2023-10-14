import { SerializedError, createSlice } from "@reduxjs/toolkit";

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
});

export { claimsStatusSlice };
export const claimsStatusListReducer = claimsStatusSlice.reducer;
