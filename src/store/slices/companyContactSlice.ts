import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchContacts } from "@thunks";

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
    addContact: (state, action: PayloadAction<ICompanyContact>) => {
      state.data.push(action.payload);
    },
    updateContact: (state, action: PayloadAction<ICompanyContact>) => {
      const index = state.data.findIndex((contact) => contact._id === action.payload._id);
      state.data[index] = action.payload;
    },
    deleteContact: (state, action: PayloadAction<string>) => {
      const index = state.data.findIndex((contact) => contact._id === action.payload);
      state.data.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchContacts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchContacts.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(fetchContacts.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.error = null;
      state.isLoading = false;
    });
  },
});

export { companyContactSlice };
export const { addContact, deleteContact, updateContact } = companyContactSlice.actions;
export const companyContactReducer = companyContactSlice.reducer;
