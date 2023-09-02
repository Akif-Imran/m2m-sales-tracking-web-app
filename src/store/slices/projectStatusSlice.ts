import { SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: IProjectStatus[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [
    { id: 1, name: "In Development" },
    { id: 2, name: "Completed" },
    { id: 3, name: "Quotation" },
    { id: 4, name: "Follow Up" },
  ],
  isLoading: false,
  error: null,
};

const projectStatusSlice = createSlice({
  name: "projectStatusList",
  initialState: initialState,
  reducers: {},
});

export { projectStatusSlice };
export const projectStatusListReducer = projectStatusSlice.reducer;
