import { apiDelete, apiGet, apiPost, apiPut, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface BaseReq {
  name: string;
  type: string;
  reason: string;
  remarks: string;
  startDate: string;
  endDate: string;
  document: null | string;
}
interface CreateReq {
  token: string;
  leave: BaseReq;
}
interface UpdateReq {
  id: string;
  token: string;
  leave: BaseReq;
}

interface DeleteReq {
  token: string;
  id: string;
}

interface StatusReq {
  token: string;
  id: string;
  body: {
    status: number;
  };
}

interface ByIdReq {
  token: string;
  id: string;
}

export const fetchLeaveStatuses = createAsyncThunk("leave/status/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<ILeaveStatus[]>>(urls.leave.statusList, token);
  return response.data;
});

export const fetchLeave = createAsyncThunk("leave/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<ILeaveApplication>>(urls.leave.list, token);
  return response.data;
});

export const getLeaveById = createAsyncThunk("leave/get", async (params: ByIdReq) => {
  const response = await apiGet<ApiResponse<ILeaveApplication>>(
    urls.leave.getById(params.id),
    params.token
  );
  return response.data;
});

export const createLeave = createAsyncThunk("leave/create", async (params: CreateReq) => {
  const response = await apiPost<ApiResponse<ILeaveApplication>, typeof params.leave>(
    urls.leave.create,
    params.token,
    params.leave
  );
  return response.data;
});

export const updateLeave = createAsyncThunk("leave/update", async (params: UpdateReq) => {
  const response = await apiPut<ApiResponse<ILeaveApplication>, typeof params.leave>(
    urls.leave.update(params.id),
    params.token,
    params.leave
  );
  return response.data;
});

export const updateStatusLeave = createAsyncThunk(
  "leave/status/update",
  async (params: StatusReq) => {
    const response = await apiPut<ApiResponse<ILeaveApplication>, typeof params.body>(
      urls.leave.updateStatus(params.id),
      params.token,
      params.body
    );
    return response.data;
  }
);

export const removeLeave = createAsyncThunk("leave/remove", async (params: DeleteReq) => {
  const response = await apiDelete<ApiResponse<ILeaveApplication>>(
    urls.leave.delete(params.id),
    params.token
  );
  return response.data;
});
