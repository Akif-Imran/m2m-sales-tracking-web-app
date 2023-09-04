import { DATE_FORMAT_YYYY_MM_DD_HH_MM_SS } from "@helpers";
import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: ITask[];
  isLoading: boolean;
  error: null | SerializedError;
}
type UpdateTaskStatus = {
  taskId: number;
  statusId: number;
  statusName: string;
};

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState: initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<ITask, "id">>) => {
      const id = Date.now();
      state.data.push({ id, ...action.payload });
    },
    updateTask: (state, action: PayloadAction<ITask>) => {
      const index = state.data.findIndex((task) => task.id === action.payload.id);
      state.data[index] = action.payload;
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((task) => task.id === action.payload);
      state.data.splice(index, 1);
    },
    updateTaskStatus: (state, action: PayloadAction<UpdateTaskStatus>) => {
      const index = state.data.findIndex((task) => task.id === action.payload.taskId);
      state.data[index].statusId = action.payload.statusId;
      state.data[index].statusName = action.payload.statusName;
      if (action.payload.statusName === "Completed") {
        state.data[index].completedDate = DATE_FORMAT_YYYY_MM_DD_HH_MM_SS(new Date());
      } else {
        state.data[index].completedDate = "";
      }
    },
  },
});

export { taskSlice };
export const { addTask, deleteTask, updateTask, updateTaskStatus } = taskSlice.actions;
export const taskReducer = taskSlice.reducer;
