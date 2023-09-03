import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: ICompany[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const companySlice = createSlice({
  name: "company",
  initialState: initialState,
  reducers: {
    addCompany: (state, action: PayloadAction<Omit<ICompany, "id">>) => {
      const id = Date.now();
      state.data.push({ id, ...action.payload });
    },
    updateCompany: (state, action: PayloadAction<ICompany>) => {
      const index = state.data.findIndex((contact) => contact.id === action.payload.id);
      state.data[index] = action.payload;
    },
    deleteCompany: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((contact) => contact.id === action.payload);
      state.data.splice(index, 1);
    },
  },
});

export { companySlice };
export const { addCompany, deleteCompany, updateCompany } = companySlice.actions;
export const companyReducer = companySlice.reducer;
