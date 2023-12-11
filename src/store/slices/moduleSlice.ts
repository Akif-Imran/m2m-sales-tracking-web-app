import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const storage_key = "m2m-sales-tracking-module";
interface State {
  module: Module;
}
const initialState: State = {
  module: localStorage ? (localStorage.getItem(storage_key) as Module) || "none" : "none",
};
const moduleSlice = createSlice({
  name: "moduleSelector",
  initialState,
  reducers: {
    setModule: (state, action: PayloadAction<Module>) => {
      state.module = action.payload;
      localStorage.setItem(storage_key, action.payload);
    },
  },
});

export { moduleSlice };
export const { setModule } = moduleSlice.actions;
export const moduleReducer = moduleSlice.reducer;
