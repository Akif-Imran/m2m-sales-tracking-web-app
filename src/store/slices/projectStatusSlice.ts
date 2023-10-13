import { SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchProjectStatuses } from "../thunks/projectThunks";

interface State {
  data: IProjectStatus[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const projectStatusSlice = createSlice({
  name: "projectStatusList",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProjectStatuses.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchProjectStatuses.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });
    builder.addCase(fetchProjectStatuses.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.error = null;
      state.isLoading = false;
    });
  },
});

export { projectStatusSlice };
export const projectStatusListReducer = projectStatusSlice.reducer;
