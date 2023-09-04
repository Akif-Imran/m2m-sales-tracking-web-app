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
      contact: {
        name: "Default Contact",
        designation: "Manager",
        email: "example.contact@gmail.com",
        phone: "+60 123 7653457",
      },
      email: "abc.company@gmail.com",
      phone: "+60 191 9998883",
      address: "123 Jalan Bukit Bintang Wilayah Persekutuan Kuala Lumpur",
      city: "Kuala Lumpur",
      country: "Malaysia",
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
    updateCompanyContact: (state, action: PayloadAction<Omit<ICompanyContact, "id">>) => {
      const index = state.data.findIndex((company) => company.id === action.payload.companyId);
      state.data[index].contact.name = action.payload.name;
      state.data[index].contact.email = action.payload.email;
      state.data[index].contact.phone = action.payload.phone;
      state.data[index].contact.designation = action.payload.designation;
    },
  },
});

export { companySlice };
export const { addCompany, deleteCompany, updateCompany, updateCompanyContact } =
  companySlice.actions;
export const companyReducer = companySlice.reducer;
