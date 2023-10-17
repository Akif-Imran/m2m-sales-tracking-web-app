import { apiDelete, apiGet, apiPost, apiPut, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface BaseReq {
  projectId: string;
  customerId: string;
  assignedTo: string;
  title: string;
  description: string;
  completionDeadline: string;
  status: number;
}
interface CreateReq {
  token: string;
  task: BaseReq;
}
interface UpdateReq {
  id: string;
  token: string;
  task: BaseReq;
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

export const fetchTaskStatuses = createAsyncThunk("task/status/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<ITaskStatus[]>>(urls.task.statusList, token);
  return response.data;
});

export const fetchTasks = createAsyncThunk("task/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<ITask[]>>(urls.task.list, token);
  return response.data;
});

export const getTaskById = createAsyncThunk("task/get", async (params: ByIdReq) => {
  const response = await apiGet<ApiResponse<ITask>>(urls.task.getById(params.id), params.token);
  return response.data;
});

export const createTask = createAsyncThunk("task/create", async (params: CreateReq) => {
  const response = await apiPost<ApiResponse<ITask>, typeof params.task>(
    urls.task.create,
    params.token,
    params.task
  );
  return response.data;
});

export const updateTask = createAsyncThunk("task/update", async (params: UpdateReq) => {
  const response = await apiPut<ApiResponse<ITask>, typeof params.task>(
    urls.task.update(params.id),
    params.token,
    params.task
  );
  return response.data;
});

export const updateStatusTask = createAsyncThunk(
  "task/status/update",
  async (params: StatusReq) => {
    const response = await apiPut<ApiResponse<ITask>, typeof params.body>(
      urls.task.updateStatus(params.id),
      params.token,
      params.body
    );
    return response.data;
  }
);

export const removeTask = createAsyncThunk("task/remove", async (params: DeleteReq) => {
  const response = await apiDelete<ApiResponse<ITask>>(urls.task.delete(params.id), params.token);
  return response.data;
});
