import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchExpenseType } from "@thunks";

interface State {
  data: IExpenseType[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const expenseTypeSlice = createSlice({
  name: "expenseTypes",
  initialState: initialState,
  reducers: {
    addExpenseType: (state, action: PayloadAction<IExpenseType>) => {
      state.data.push(action.payload);
    },
    modifyExpenseType: (state, action: PayloadAction<IExpenseType>) => {
      const index = state.data.findIndex((type) => type._id === action.payload._id);
      state.data[index] = action.payload;
    },
    deleteExpenseType: (state, action: PayloadAction<string>) => {
      const index = state.data.findIndex((type) => type._id === action.payload);
      state.data.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchExpenseType.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchExpenseType.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(fetchExpenseType.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.error = null;
      state.isLoading = false;
    });
  },
});

export { expenseTypeSlice };
export const { addExpenseType, modifyExpenseType, deleteExpenseType } = expenseTypeSlice.actions;
export const expenseTypeReducer = expenseTypeSlice.reducer;
