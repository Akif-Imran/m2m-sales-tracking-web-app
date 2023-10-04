import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: IUser[];
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: [
    {
      avatar: "",
      id: 1,
      firstName: "John",
      lastName: "Doe",
      companyId: 1,
      email: "admin@example.com",
      password: "123",
      phone: "+1 (123) 456-7890",
      departmentId: 1,
      departmentName: "Engineering",
      designation: "Worker",
      joiningDate: "2023-10-04T11:34:30.648Z",
      address: "123 Main Street",
      city: "New York",
      country: "USA",
      userTypeId: 1,
      userTypeName: "Admin",
    },
    {
      avatar: "",
      id: 2,
      firstName: "Alice",
      lastName: "Smith",
      companyId: 1,
      email: "sales@example.com",
      password: "123",
      phone: "+1 (987) 654-3210",
      departmentId: 1,
      departmentName: "Sales",
      designation: "Worker",
      joiningDate: "2023-10-04T11:34:30.648Z",
      address: "456 Elm Avenue",
      city: "Los Angeles",
      country: "USA",
      userTypeId: 2,
      userTypeName: "Sales",
    },
    {
      avatar: "",
      id: 3,
      firstName: "Bob",
      lastName: "Johnson",
      companyId: 1,
      email: "engineer@example.com",
      password: "123",
      phone: "+44 20 1234 5678",
      departmentId: 2,
      departmentName: "Engineering",
      designation: "Worker",
      joiningDate: "2023-10-04T11:34:30.648Z",
      address: "789 Oak Lane",
      city: "London",
      country: "UK",
      userTypeId: 3,
      userTypeName: "Engineer",
    },
    {
      avatar: "",
      id: 4,
      firstName: "Bob",
      lastName: "Johnson",
      companyId: 1,
      email: "hr@example.com",
      password: "123",
      phone: "+44 20 1234 5678",
      departmentId: 2,
      departmentName: "Engineering",
      designation: "Worker",
      joiningDate: "2023-10-04T11:34:30.648Z",
      address: "789 Oak Lane",
      city: "London",
      country: "UK",
      userTypeId: 4,
      userTypeName: "HR",
    },
  ],
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
