import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface State {
  module: Module;
}
const initialState: State = {
  module: "none",
};
const moduleSlice = createSlice({
  name: "moduleSelector",
  initialState,
  reducers: {
    setModule: (state, action: PayloadAction<Module>) => {
      state.module = action.payload;
    },
  },
});

export { moduleSlice };
export const { setModule } = moduleSlice.actions;
export const moduleReducer = moduleSlice.reducer;
