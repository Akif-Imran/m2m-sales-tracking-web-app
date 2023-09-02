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
  name: "devices",
  initialState: initialState,
  reducers: {
    addCompany: (state, action: PayloadAction<ICompany>) => {
      console.log(state, action.type);
    },
  },
});

export { companySlice };
export const { addCompany } = companySlice.actions;
export const companyReducer = companySlice.reducer;
