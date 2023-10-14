import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchFollowUps } from "@thunks";

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
    addFollowUp: (state, action: PayloadAction<IFollowUp>) => {
      state.data.push(action.payload);
    },
    modifyFollowUp: (state, action: PayloadAction<IFollowUp>) => {
      const index = state.data.findIndex((followup) => followup._id === action.payload._id);
      state.data[index] = action.payload;
    },
    deleteFollowUp: (state, action: PayloadAction<string>) => {
      const index = state.data.findIndex((followup) => followup._id === action.payload);
      state.data.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFollowUps.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchFollowUps.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(fetchFollowUps.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.error = null;
      state.isLoading = false;
    });
  },
});

export { followUpSlice };
export const { addFollowUp, deleteFollowUp, modifyFollowUp } = followUpSlice.actions;
export const followUpReducer = followUpSlice.reducer;
