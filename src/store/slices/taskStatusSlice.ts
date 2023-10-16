import { SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: ITaskStatus[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const taskStatusSlice = createSlice({
  name: "taskStatusList",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export { taskStatusSlice };
export const taskStatusListReducer = taskStatusSlice.reducer;
