import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchTasks } from "../thunks/taskThunks";

interface State {
  data: ITask[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState: initialState,
  reducers: {
    addTask: (state, action: PayloadAction<ITask>) => {
      state.data.push(action.payload);
    },
    modifyTask: (state, action: PayloadAction<ITask>) => {
      const index = state.data.findIndex((task) => task._id === action.payload._id);
      state.data[index] = action.payload;
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      const index = state.data.findIndex((task) => task._id === action.payload);
      state.data.splice(index, 1);
    },
    modifyTaskStatus: (state, action: PayloadAction<ITask>) => {
      const index = state.data.findIndex((task) => task._id === action.payload._id);
      state.data[index] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
        state.data = [
          {
            _id: "652e5ffa2e17c8907373f9b2",
            createdBy: "65258520a7816043f5b0cf47",
            createdAt: "2023-10-17T10:20:42.406Z",
            isActive: true,
            company: "65258520a7816043f5b0cf45",
            assignedTo: "652ba0e017c1e3516060d1c4",
            projectId: "652e5fce2e17c8907373f9ad",
            title: "Meet with the person and add follow up details",
            description: "this the description of the task",
            completionDeadline: "2023-10-21T10:00:37.437Z",
            status: 1,
            customerId: "652e5f982e17c8907373f9a9",
            __v: 0,
          },
        ];
      }
      state.error = null;
      state.isLoading = false;
    });
  },
});

export { taskSlice };
export const { addTask, deleteTask, modifyTask, modifyTaskStatus } = taskSlice.actions;
export const taskReducer = taskSlice.reducer;
