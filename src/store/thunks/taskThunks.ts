import { apiGet, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTasks = createAsyncThunk("task/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<ITask>>(urls.claims.list, token);
  return response.data;
});
