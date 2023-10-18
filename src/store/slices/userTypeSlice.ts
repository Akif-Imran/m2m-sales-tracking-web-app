import { SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchUserTypes } from "@thunks";

interface State {
  data: IUserType[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const userTypeSlice = createSlice({
  name: "userTypeList",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserTypes.pending, (state) => {
      state.error = null;
      state.isLoading = true;
    });
    builder.addCase(fetchUserTypes.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });
    builder.addCase(fetchUserTypes.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.isLoading = false;
      state.error = null;
    });
  },
});

export { userTypeSlice };
// export const { } = userTypeSlice.actions;
export const userTypeReducer = userTypeSlice.reducer;
