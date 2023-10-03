import { SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: IProjectStatus[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [
    { id: 1, name: "Follow up added (10%)" },
    { id: 2, name: "Quotation submitted (30%)" },
    { id: 3, name: "Work order received (60%)" },
    { id: 4, name: "Payment received (80%)" },
    { id: 5, name: "Delivered (100%)" },
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
