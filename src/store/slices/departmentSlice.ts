import { SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: IDepartmentType[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [
    { id: 1, name: "Sales" },
    { id: 2, name: "Engineering" },
    { id: 3, name: "Account / HR" },
  ],
  isLoading: false,
  error: null,
};

const departmentSlice = createSlice({
  name: "departmentList",
  initialState: initialState,
  reducers: {},
});

export { departmentSlice };
export const departmentReducer = departmentSlice.reducer;
