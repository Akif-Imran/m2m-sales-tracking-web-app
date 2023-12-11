import { MODULE_SLICE_STORAGE_KEY } from "@constants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface State {
  module: Module;
}
const initialState: State = {
  module: localStorage
    ? (localStorage.getItem(MODULE_SLICE_STORAGE_KEY) as Module) || "none"
    : "none",
};
const moduleSlice = createSlice({
  name: "moduleSelector",
  initialState,
  reducers: {
    setModule: (state, action: PayloadAction<Module>) => {
      state.module = action.payload;
      localStorage.setItem(MODULE_SLICE_STORAGE_KEY, action.payload);
    },
  },
});

export { moduleSlice };
export const { setModule } = moduleSlice.actions;
export const moduleReducer = moduleSlice.reducer;
