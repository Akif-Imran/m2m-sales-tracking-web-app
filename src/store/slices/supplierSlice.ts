import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: ISupplier[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [
    {
      id: 1,
      name: "Supplier 1",
      email: "supplier1@example.com",
      phone: "+62 987 1234567",
      address: " Taman Padi Emas, Jalan Alor Mengkudu",
      city: "Alor Setar",
      state: "Kedah",
      country: "Malaysia",
      websiteURL: "https://www.supplier1.com",
    },
  ],
  isLoading: false,
  error: null,
};

const supplierSlice = createSlice({
  name: "supplier",
  initialState: initialState,
  reducers: {
    addSupplier: (state, action: PayloadAction<Omit<ISupplier, "id">>) => {
      const id = Date.now();
      state.data.push({ id, ...action.payload });
    },
    updateSupplier: (state, action: PayloadAction<ISupplier>) => {
      const index = state.data.findIndex((supplier) => supplier.id === action.payload.id);
      state.data[index] = action.payload;
    },
    deleteSupplier: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((supplier) => supplier.id === action.payload);
      state.data.splice(index, 1);
    },
  },
});

export { supplierSlice };
export const { addSupplier, deleteSupplier, updateSupplier } = supplierSlice.actions;
export const supplierReducer = supplierSlice.reducer;
