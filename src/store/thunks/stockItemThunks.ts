import { apiDelete, apiGet, apiPost, apiPut, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface BaseReq {
  name: string;
  type: string;
  serialNo: string;
  modelNo: string;
  totalCost: number;
  quantity: number;
  warehouseId: string;
  supplierId: string;
  assignedTo: string;
}
interface CreateReq {
  token: string;
  stock: BaseReq;
}

interface UpdateReq {
  token: string;
  id: string;
  stock: BaseReq;
}

interface DeleteReq {
  token: string;
  id: string;
}

interface ByIdReq {
  token: string;
  id: string;
}

export const createStock = createAsyncThunk("stock/create", async (params: CreateReq) => {
  const response = await apiPost<ApiResponse<IStock>, typeof params.stock>(
    urls.stock.create,
    params.token,
    params.stock
  );
  return response.data;
});

export const updateStock = createAsyncThunk("stock/update", async (params: UpdateReq) => {
  const response = await apiPut<ApiResponse<IStock>, typeof params.stock>(
    urls.stock.update(params.id),
    params.token,
    params.stock
  );
  return response.data;
});

export const removeStock = createAsyncThunk("stock/delete", async (params: DeleteReq) => {
  const response = await apiDelete<ApiResponse<IStock>>(urls.stock.delete(params.id), params.token);
  return response.data;
});

export const fetchStock = createAsyncThunk("stock/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<IStock[]>>(urls.stock.list(), token);
  return response.data;
});

//this api does not exits for now.
export const fetchStockStatuses = createAsyncThunk("stock/status/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<IStockItemStatus[]>>(urls.stock.statusList, token);
  return response.data;
});

export const getStockById = createAsyncThunk("stock/get", async (params: ByIdReq) => {
  const response = await apiGet<ApiResponse<IStock>>(urls.stock.getById(params.id), params.token);
  return response.data;
});
