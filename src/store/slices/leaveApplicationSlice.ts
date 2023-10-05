import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: ILeaveApplication[];
  isLoading: boolean;
  error: null | SerializedError;
}
type UpdateStatus = { leaveId: number; statusId: number; statusName: string; remarks: string };

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const leaveApplicationSlice = createSlice({
  name: "leaves",
  initialState: initialState,
  reducers: {
    addLeave: (state, action: PayloadAction<Omit<ILeaveApplication, "id">>) => {
      const id = Date.now();
      state.data.push({ id, ...action.payload });
    },
    updateLeave: (state, action: PayloadAction<ILeaveApplication>) => {
      const index = state.data.findIndex((contact) => contact.id === action.payload.id);
      state.data[index] = action.payload;
    },
    updateLeaveStatus: (state, action: PayloadAction<UpdateStatus>) => {
      const index = state.data.findIndex((project) => project.id === action.payload.leaveId);
      state.data[index].statusId = action.payload.statusId;
      state.data[index].statusName = action.payload.statusName;
      state.data[index].remarks = action.payload.remarks;
    },
    deleteLeave: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((contact) => contact.id === action.payload);
      state.data.splice(index, 1);
    },
  },
});

export { leaveApplicationSlice as leaveSlice };
export const { addLeave, deleteLeave, updateLeave, updateLeaveStatus } =
  leaveApplicationSlice.actions;
export const leaveApplicationReducer = leaveApplicationSlice.reducer;
