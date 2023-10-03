import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { updatePrimaryContact } from "./companySlice";

interface State {
  data: ICompanyContact[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [
    {
      id: 1,
      name: "Default Contact",
      businessCard: "",
      department: "Engineering",
      designation: "Manager",
      email: "example.contact@gmail.com",
      mobile: "+62 756 345987",
      phone: "+60 123 7653457",
      primary: true,
      companyId: 1,
    },
  ],
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
  extraReducers: (builder) => {
    builder.addCase(updatePrimaryContact, (state, action) => {
      for (const c of state.data) {
        if (c.companyId === action.payload.companyId) {
          if (c.id === action.payload.contactId) {
            c.primary = true;
          } else {
            c.primary = false;
          }
        }
      }
    });
  },
});

export { companyContactSlice };
export const { addContact, deleteContact, updateContact } = companyContactSlice.actions;
export const companyContactReducer = companyContactSlice.reducer;
