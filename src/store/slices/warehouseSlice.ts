import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchWarehouse } from "@thunks";

interface State {
  data: IWarehouse[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const warehouseSlice = createSlice({
  name: "warehouse",
  initialState: initialState,
  reducers: {
    addWarehouse: (state, action: PayloadAction<IWarehouse>) => {
      state.data.push(action.payload);
    },
    modifyWarehouse: (state, action: PayloadAction<IWarehouse>) => {
      const index = state.data.findIndex((type) => type._id === action.payload._id);
      state.data[index] = action.payload;
    },
    deleteWarehouse: (state, action: PayloadAction<string>) => {
      const index = state.data.findIndex((type) => type._id === action.payload);
      state.data.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWarehouse.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchWarehouse.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(fetchWarehouse.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.error = null;
      state.isLoading = false;
    });
  },
});

export { warehouseSlice };
export const { addWarehouse, modifyWarehouse, deleteWarehouse } = warehouseSlice.actions;
export const warehouseReducer = warehouseSlice.reducer;
