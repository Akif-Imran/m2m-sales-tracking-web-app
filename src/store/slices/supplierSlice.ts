import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { createSupplier, fetchSuppliers } from "@thunks";

interface State {
  data: ISupplier[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [
    {
      createdBy: "65258520a7816043f5b0cf47",
      createdAt: "2023-10-14T13:03:16.715Z",
      isActive: true,
      company: "65258520a7816043f5b0cf45",
      name: "Default Supplier Demo",
      businessCard: "Some info",
      designation: "Manager",
      department: "Support",
      email: "example@email.com",
      mobile: "2344",
      address: "this is the address",
      city: "Kuala Lumpur",
      state: "Selangor",
      country: "Malaysia",
      website: "https://www.abc.com",
      customerId: "652506a266869aaf01825588",
      _id: "652a9194b107af6cea0d604f",
      __v: 0,
    },
  ],
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
