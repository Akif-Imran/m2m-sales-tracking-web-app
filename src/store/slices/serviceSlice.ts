import { SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: ListResponse<IService[]>;
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: { count: 0, rows: [] },
  isLoading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: "services",
  initialState: initialState,
  reducers: {},
});

export { serviceSlice };
// export const {} = serviceSlice.actions;
export const serviceReducer = serviceSlice.reducer;