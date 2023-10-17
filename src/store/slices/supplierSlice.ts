import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { createSupplier, fetchSuppliers } from "@thunks";

interface State {
  data: ISupplier[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const supplierSlice = createSlice({
  name: "supplier",
  initialState: initialState,
  reducers: {
    addSupplier: (state, action: PayloadAction<ISupplier>) => {
      state.data.push(action.payload);
    },
    modifySupplier: (state, action: PayloadAction<ISupplier>) => {
      const index = state.data.findIndex((supplier) => supplier._id === action.payload._id);
      state.data[index] = action.payload;
    },
    deleteSupplier: (state, action: PayloadAction<string>) => {
      const index = state.data.findIndex((supplier) => supplier._id === action.payload);
      state.data.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSuppliers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchSuppliers.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(fetchSuppliers.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.error = null;
      state.isLoading = false;
    });

    builder.addCase(createSupplier.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data.push(action.payload.data);
      }
    });
  },
});

export { supplierSlice };
export const { addSupplier, deleteSupplier, modifySupplier } = supplierSlice.actions;
export const supplierReducer = supplierSlice.reducer;
