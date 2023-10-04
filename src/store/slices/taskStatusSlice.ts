import { SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: ITaskStatus[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [
    { id: 1, name: "Pending" },
    { id: 2, name: "Accepted" },
    { id: 5, name: "Completed" },
  ],
  isLoading: false,
  error: null,
};

const taskStatusSlice = createSlice({
  name: "taskStatusList",
  initialState: initialState,
  reducers: {},
});

export { taskStatusSlice };
export const taskStatusListReducer = taskStatusSlice.reducer;