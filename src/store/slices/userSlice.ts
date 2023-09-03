import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";

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
    addUser: (state, action: PayloadAction<Omit<IUser, "id">>) => {
      const id = Date.now();
      state.data.push({ id, ...action.payload });
    },
    updateUser: (state, action: PayloadAction<IUser>) => {
      const index = state.data.findIndex((contact) => contact.id === action.payload.id);
      state.data[index] = action.payload;
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((contact) => contact.id === action.payload);
      state.data.splice(index, 1);
    },
  },
});

export { userSlice };
export const { addUser, deleteUser, updateUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
