import { SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchStockItemStatuses } from "@thunks";

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
    builder.addCase(fetchStockItemStatuses.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchStockItemStatuses.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    });
    builder.addCase(fetchStockItemStatuses.fulfilled, (state, action) => {
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
