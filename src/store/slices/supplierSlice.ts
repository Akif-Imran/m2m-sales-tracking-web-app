import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";

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
    updateSupplier: (state, action: PayloadAction<ISupplier>) => {
      const index = state.data.findIndex((supplier) => supplier._id === action.payload._id);
      state.data[index] = action.payload;
    },
    deleteSupplier: (state, action: PayloadAction<string>) => {
      const index = state.data.findIndex((supplier) => supplier._id === action.payload);
      state.data.splice(index, 1);
    },
  },
});

export { supplierSlice };
export const { addSupplier, deleteSupplier, updateSupplier } = supplierSlice.actions;
export const supplierReducer = supplierSlice.reducer;
