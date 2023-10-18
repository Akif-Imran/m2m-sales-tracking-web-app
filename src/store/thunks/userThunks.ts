import { apiDelete, apiGet, apiPost, apiPut, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface BaseReq {
  name: string;
  userType: number;
  email: string;
  password: string;
  joiningDate: string;
  designation: string;
  department: string;
  mobile: string;
}
interface CreateReq {
  token: string;
  user: BaseReq;
}
interface UpdateReq {
  id: string;
  token: string;
  user: BaseReq;
}

interface DeleteReq {
  token: string;
  id: string;
}

interface ByIdReq {
  token: string;
  id: string;
}

export const fetchUserTypes = createAsyncThunk("userTypes/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<IUserType[]>>(urls.user.getUserTypes, token);
  return response.data;
});

export const fetchUsers = createAsyncThunk("user/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<IUser[]>>(urls.user.list, token);
  return response.data;
});

export const removeUser = createAsyncThunk("user/remove", async (params: DeleteReq) => {
  const response = await apiDelete<ApiResponse<IUser>>(urls.user.delete(params.id), params.token);
  return response.data;
});

export const getUserById = createAsyncThunk("user/get", async (params: ByIdReq) => {
  const response = await apiGet<ApiResponse<IUser>>(urls.user.getById(params.id), params.token);
  return response.data;
});

export const createUser = createAsyncThunk("user/create", async (params: CreateReq) => {
  const response = await apiPost<ApiResponse<IUser>, typeof params.user>(
    urls.user.create,
    params.token,
    params.user
  );
  return response.data;
});

export const updateUser = createAsyncThunk("user/update", async (params: UpdateReq) => {
  const response = await apiPut<ApiResponse<IUser>, typeof params.user>(
    urls.user.update(params.id),
    params.token,
    params.user
  );
  return response.data;
});
