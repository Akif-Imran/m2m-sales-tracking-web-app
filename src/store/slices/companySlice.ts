import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchAllCompanies } from "@thunks";

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
    addCompany: (state, action: PayloadAction<ICompany>) => {
      state.data.push(action.payload);
    },
    updateCompany: (state, action: PayloadAction<ICompany>) => {
      const index = state.data.findIndex((company) => company._id === action.payload._id);
      state.data[index] = action.payload;
    },
    deleteCompany: (state, action: PayloadAction<ICompany>) => {
      const index = state.data.findIndex((company) => company._id === action.payload._id);
      state.data.splice(index, 1);
    },
    // updatePrimaryContact: (state, action: PayloadAction<IUpdatePrimaryContactPayload>) => {
    //   const index = state.data.findIndex((company) => company.id === action.payload.companyId);
    //   state.data[index].primaryContactId = action.payload.contactId;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllCompanies.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllCompanies.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(fetchAllCompanies.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.error = null;
      state.isLoading = false;
    });
  },
});

export { companySlice };
export const { addCompany, deleteCompany, updateCompany } = companySlice.actions;
export const companyReducer = companySlice.reducer;

// interface IUpdatePrimaryContactPayload {
//   companyId: number;
//   contactId: number;
// }
