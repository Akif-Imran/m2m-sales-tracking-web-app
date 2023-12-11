import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchStock } from "@thunks";
interface State {
  data: IStock[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const stockSlice = createSlice({
  name: "stock",
  initialState: initialState,
  reducers: {
    addStock: (state, action: PayloadAction<IStock>) => {
      state.data.push(action.payload);
    },
    modifyStock: (state, action: PayloadAction<IStock>) => {
      const index = state.data.findIndex((item) => item._id === action.payload._id);
      state.data[index] = action.payload;
    },
    deleteStock: (state, action: PayloadAction<string>) => {
      const index = state.data.findIndex((item) => item._id === action.payload);
      state.data.splice(index, 1);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchStock.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchStock.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(fetchStock.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.error = null;
      state.isLoading = false;
    });
  },
});

export { stockSlice as stockItemSlice };
export const { addStock, modifyStock, deleteStock } = stockSlice.actions;
export const stockReducer = stockSlice.reducer;
