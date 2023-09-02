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

const companyContactSlice = createSlice({
  name: "companyContacts",
  initialState: initialState,
  reducers: {
    addContact: (state, action: PayloadAction<ICompany>) => {
      state.data.push(action.payload);
    },
    updateContact: (state, action: PayloadAction<ICompany>) => {},
    deleteContact: (state, action: PayloadAction<ICompany>) => {},
  },
});

export { companyContactSlice };
export const { addContact, deleteContact, updateContact } = companyContactSlice.actions;
export const companyContactReducer = companyContactSlice.reducer;
