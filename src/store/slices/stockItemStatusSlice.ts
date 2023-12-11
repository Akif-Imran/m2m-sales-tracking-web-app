import { SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchStockStatuses } from "@thunks";

interface State {
  data: IStockItemStatus[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [
    {
      id: 1,
      name: "Assigned",
    },
    {
      id: 2,
      name: "Unassigned",
    },
  ],
  isLoading: false,
  error: null,
};

const stockItemStatusSlice = createSlice({
  name: "stockItemStatusList",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStockStatuses.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchStockStatuses.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });
    builder.addCase(fetchStockStatuses.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.error = null;
      state.isLoading = false;
    });
  },
});

export { stockItemStatusSlice };
export const stockItemStatusListReducer = stockItemStatusSlice.reducer;
