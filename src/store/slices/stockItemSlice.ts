import { faker } from "@faker-js/faker";
import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { fetchStockItem } from "@thunks";

interface AssignTo {
  _id: string; //assign this item
  userId: string; //to this user
}
interface State {
  data: IStockItem[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [
    {
      _id: "652d5bea6d554b35fedcd012",
      createdBy: "65258520a7816043f5b0cf47",
      createdAt: "2023-10-16T15:51:06.229Z",
      isActive: true,
      company: "65258520a7816043f5b0cf45",
      name: "Petronas Laptop",
      type: "Electronics",
      assignedTo: "652ba0e017c1e3516060d1c4",
      cost: {
        amount: 5000,
        currency: "MYR",
      },
      image: faker.image.avatar(),
      no: faker.number.int({ min: 1 }),
      status: 1,
      __v: 0,
    },
    {
      _id: "652d5bea6d554b35fedcd013",
      createdBy: "65258520a7816043f5b0cf47",
      createdAt: "2023-10-16T15:51:06.229Z",
      isActive: true,
      company: "65258520a7816043f5b0cf45",
      name: "IOS Device",
      type: "Electronics",
      assignedTo: "",
      cost: {
        amount: 5000,
        currency: "MYR",
      },
      image: faker.image.avatarGitHub(),
      no: faker.number.int({ min: 1 }),
      status: 2,
      __v: 0,
    },
  ],
  isLoading: false,
  error: null,
};

const stockItemSlice = createSlice({
  name: "stockItem",
  initialState: initialState,
  reducers: {
    addStockItem: (state, action: PayloadAction<IStockItem>) => {
      state.data.push(action.payload);
    },
    modifyStockItem: (state, action: PayloadAction<IStockItem>) => {
      const index = state.data.findIndex((item) => item._id === action.payload._id);
      state.data[index] = action.payload;
    },
    deleteStockItem: (state, action: PayloadAction<string>) => {
      const index = state.data.findIndex((item) => item._id === action.payload);
      state.data.splice(index, 1);
    },
    assignTo: (state, action: PayloadAction<AssignTo>) => {
      const index = state.data.findIndex((item) => item._id === action.payload._id);
      state.data[index].assignedTo = action.payload.userId;
      state.data[index].status = 1; //assigned to user
    },
    unassign: (state, action: PayloadAction<string>) => {
      const index = state.data.findIndex((item) => item._id === action.payload);
      state.data[index].assignedTo = "";
      state.data[index].status = 2; //unassigned from user
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStockItem.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchStockItem.rejected, (state, action) => {
      state.error = action.error;
      state.isLoading = false;
    });
    builder.addCase(fetchStockItem.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.data = action.payload.data;
      }
      state.error = null;
      state.isLoading = false;
    });
  },
});

export { stockItemSlice };
export const { addStockItem, modifyStockItem, deleteStockItem, assignTo, unassign } =
  stockItemSlice.actions;
export const stockItemReducer = stockItemSlice.reducer;
