import { apiGet, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserTypes = createAsyncThunk("userTypes/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<IUserType[]>>(urls.user.getUserTypes, token);
  return response.data;
});

export const fetchUsers = createAsyncThunk("fetch/users", async (token: string) => {
  const response = await apiGet<ApiResponse<IUser[]>>(urls.user.list, token);
  return response.data;
});
