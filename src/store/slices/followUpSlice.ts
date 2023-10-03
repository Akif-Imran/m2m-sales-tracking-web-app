import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: IFollowUp[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const followUpSlice = createSlice({
  name: "followUp",
  initialState: initialState,
  reducers: {
    addFollowUp: (state, action: PayloadAction<Omit<IFollowUp, "id">>) => {
      const id = Date.now();
      state.data.push({ id, ...action.payload });
    },
    updateFollowUp: (state, action: PayloadAction<IFollowUp>) => {
      const index = state.data.findIndex((followup) => followup.id === action.payload.id);
      state.data[index] = action.payload;
    },
    deleteFollowUp: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((followup) => followup.id === action.payload);
      state.data.splice(index, 1);
    },
  },
});

export { followUpSlice };
export const { addFollowUp, deleteFollowUp, updateFollowUp } = followUpSlice.actions;
export const followUpReducer = followUpSlice.reducer;
