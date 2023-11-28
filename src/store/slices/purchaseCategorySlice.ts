import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchPurchaseCategory } from "@thunks";

interface State {
  data: IPurchaseCategory[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [
    {
      _id: "6540a36de8f549d1e0ce2756",
      createdBy: "65258520a7816043f5b0cf47",
      createdAt: "2023-10-31T06:49:17.961Z",
      isActive: true,
      company: "65258520a7816043f5b0cf45",
      name: "P (Project)",
      description: "This is the description of project",
      __v: 0,
    },
    {
      _id: "6540a36de8f658d1e0ce2756",
      createdBy: "65258520a7816043f5b0cf47",
      createdAt: "2023-10-31T06:49:17.961Z",
      isActive: true,
      company: "65258520a7816043f5b0cf45",
      name: "PS (Pre. Sales)",
      description: "This is the description of pre sales category",
      __v: 0,
    },
  ],
  isLoading: false,
  error: null,
};

const purchaseCategorySlice = createSlice({
  name: "purchaseCategory",
  initialState: initialState,
  reducers: {
    addPurchaseCategory: (state, action: PayloadAction<IPurchaseCategory>) => {
      state.data.push(action.payload);
    },
    modifyPurchaseCategory: (state, action: PayloadAction<IExpenseType>) => {
      const index = state.data.findIndex((type) => type._id === action.payload._id);
      state.data[index] = action.payload;
    },
    deletePurchaseCategory: (state, action: PayloadAction<string>) => {
      const index = state.data.findIndex((type) => type._id === action.payload);
      state.data.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPurchaseCategory.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchPurchaseCategory.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(fetchPurchaseCategory.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.error = null;
      state.isLoading = false;
    });
  },
});

export { purchaseCategorySlice };
export const { addPurchaseCategory, modifyPurchaseCategory, deletePurchaseCategory } =
  purchaseCategorySlice.actions;
export const purchaseCategoryReducer = purchaseCategorySlice.reducer;
