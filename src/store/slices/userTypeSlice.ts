import { SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: IUserAccountType[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [
    { id: 1, name: "Admin" },
    { id: 2, name: "Sales" },
    { id: 3, name: "Engineer" },
    { id: 4, name: "HR" },
  ],
  isLoading: false,
  error: null,
};

const userTypeSlice = createSlice({
  name: "userTypeList",
  initialState: initialState,
  reducers: {},
});

export { userTypeSlice };
// export const { } = userTypeSlice.actions;
export const userTypeReducer = userTypeSlice.reducer;
