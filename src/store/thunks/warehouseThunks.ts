import { apiDelete, apiGet, apiPost, apiPut, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface CreateReq {
  token: string;
  warehouse: {
    name: string;
    description: string;
  };
}

interface UpdateReq {
  token: string;
  id: string;
  warehouse: {
    name: string;
    description: string;
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

export const createWarehouse = createAsyncThunk("warehouse/create", async (params: CreateReq) => {
  const response = await apiPost<ApiResponse<IWarehouse>, typeof params.warehouse>(
    urls.warehouse.create,
    params.token,
    params.warehouse
  );
  return response.data;
});

export const updateWarehouse = createAsyncThunk("warehouse/update", async (params: UpdateReq) => {
  const response = await apiPut<ApiResponse<IWarehouse>, typeof params.warehouse>(
    urls.warehouse.update(params.id),
    params.token,
    params.warehouse
  );
  return response.data;
});

export const removeWarehouse = createAsyncThunk("warehouse/delete", async (params: DeleteReq) => {
  const response = await apiDelete<ApiResponse<IWarehouse>>(
    urls.warehouse.delete(params.id),
    params.token
  );
  return response.data;
});

export const fetchWarehouse = createAsyncThunk("warehouse/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<IWarehouse[]>>(urls.warehouse.list(), token);
  return response.data;
});

export const getWarehouseById = createAsyncThunk("warehouse/get", async (params: ByIdReq) => {
  const response = await apiGet<ApiResponse<IWarehouse>>(
    urls.warehouse.getById(params.id),
    params.token
  );
  return response.data;
});
