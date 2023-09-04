import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: ICompanyContact[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const companyContactSlice = createSlice({
  name: "companyContacts",
  initialState: initialState,
  reducers: {
    addContact: (state, action: PayloadAction<Omit<ICompanyContact, "id">>) => {
      const id = Date.now();
      state.data.push({ id, ...action.payload });
    },
    updateContact: (state, action: PayloadAction<ICompanyContact>) => {
      const index = state.data.findIndex((contact) => contact.id === action.payload.id);
      state.data[index] = action.payload;
    },
    deleteContact: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((contact) => contact.id === action.payload);
      state.data.splice(index, 1);
    },
  },
});

export { companyContactSlice };
export const { addContact, deleteContact, updateContact } = companyContactSlice.actions;
export const companyContactReducer = companyContactSlice.reducer;
