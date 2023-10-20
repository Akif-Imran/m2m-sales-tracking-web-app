import { apiDelete, apiGet, apiPost, apiPut, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface CreateReq {
  token: string;
  expenseType: {
    name: string;
  };
}

interface UpdateReq {
  token: string;
  id: string;
  expenseType: {
    name: string;
  };
}

interface DeleteReq {
  token: string;
  id: string;
}

interface ByIdReq {
  token: string;
  id: string;
}

export const createExpenseType = createAsyncThunk(
  "expenseType/create",
  async (params: CreateReq) => {
    const response = await apiPost<ApiResponse<IExpenseType>, typeof params.expenseType>(
      urls.expenseType.create,
      params.token,
      params.expenseType
    );
    return response.data;
  }
);

export const updateExpenseType = createAsyncThunk(
  "expenseType/update",
  async (params: UpdateReq) => {
    const response = await apiPut<ApiResponse<IExpenseType>, typeof params.expenseType>(
      urls.expenseType.update(params.id),
      params.token,
      params.expenseType
    );
    return response.data;
  }
);

export const removeExpenseType = createAsyncThunk(
  "expenseType/delete",
  async (params: DeleteReq) => {
    const response = await apiDelete<ApiResponse<IExpenseType>>(
      urls.expenseType.delete(params.id),
      params.token
    );
    return response.data;
  }
);

export const fetchExpenseType = createAsyncThunk("expenseType/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<IExpenseType[]>>(urls.expenseType.list, token);
  return response.data;
});

export const getExpenseTypeById = createAsyncThunk("expenseType/get", async (params: ByIdReq) => {
  const response = await apiGet<ApiResponse<IExpenseType>>(
    urls.expenseType.getById(params.id),
    params.token
  );
  return response.data;
});
