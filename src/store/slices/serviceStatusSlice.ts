import { SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: IServiceStatus[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};
const serviceStatusSlice = createSlice({
  name: "serviceStatusList",
  initialState: initialState,
  reducers: {},
});

export { serviceStatusSlice };
// export const {} = serviceStatusSlice.actions;
export const serviceStatusReducer = serviceStatusSlice.reducer;
