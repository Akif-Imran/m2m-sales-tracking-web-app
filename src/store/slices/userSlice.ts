import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchUsers } from "../thunks/userThunks";

interface State {
  data: IUser[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    addUser: (state, action: PayloadAction<IUser>) => {
      state.data.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<IUser>) => {
      const index = state.data.findIndex((user) => user._id === action.payload._id);
      state.data[index] = action.payload;
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      const index = state.data.findIndex((user) => user._id === action.payload);
      state.data.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.isLoading = false;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.error = null;
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.isLoading = false;
    });
  },
});

export { userSlice };
export const { addUser, deleteUser, updateUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
