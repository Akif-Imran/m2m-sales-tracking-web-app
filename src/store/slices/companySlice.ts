import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: ICompany[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [
    {
      id: 1,
      logo: "",
      name: "ABC Tech Solutions Sdn Bhd",
      email: "abc.company@gmail.com",
      phone: "+60 191 9998883",
      address: "123 Jalan Bukit Bintang Wilayah Persekutuan Kuala Lumpur",
      city: "Kuala Lumpur",
      state: "Wilayah Persekutuan",
      website: "https://www.abc.com",
      country: "Malaysia",
      primaryContactId: 1,
    },
  ],
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
      const index = state.data.findIndex((company) => company.id === action.payload.id);
      state.data[index] = action.payload;
    },
    deleteCompany: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((company) => company.id === action.payload);
      state.data.splice(index, 1);
    },
    updatePrimaryContact: (state, action: PayloadAction<IUpdatePrimaryContactPayload>) => {
      const index = state.data.findIndex((company) => company.id === action.payload.companyId);
      state.data[index].primaryContactId = action.payload.contactId;
    },
  },
});

export { companySlice };
export const { addCompany, deleteCompany, updateCompany, updatePrimaryContact } =
  companySlice.actions;
export const companyReducer = companySlice.reducer;

interface IUpdatePrimaryContactPayload {
  companyId: number;
  contactId: number;
}
