import { apiDelete, apiGet, apiPost, apiPut, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface BaseReq {
  no?: number;
  image?: string;
  assignedTo?: string;
  status?: number;
  name: string;
  type: string;
  cost: {
    amount: number;
    currency: string;
  };
}
interface CreateReq {
  token: string;
  stockItem: BaseReq;
}

interface UpdateReq {
  token: string;
  id: string;
  stockItem: BaseReq;
}

interface DeleteReq {
  token: string;
  id: string;
}

interface ByIdReq {
  token: string;
  id: string;
}

export const createStockItem = createAsyncThunk("stockItem/create", async (params: CreateReq) => {
  const response = await apiPost<ApiResponse<IStockItem>, typeof params.stockItem>(
    urls.stockItem.create,
    params.token,
    params.stockItem
  );
  return response.data;
});

export const updateStockItem = createAsyncThunk("stockItem/update", async (params: UpdateReq) => {
  const response = await apiPut<ApiResponse<IStockItem>, typeof params.stockItem>(
    urls.stockItem.update(params.id),
    params.token,
    params.stockItem
  );
  return response.data;
});

export const removeStockItem = createAsyncThunk("stockItem/delete", async (params: DeleteReq) => {
  const response = await apiDelete<ApiResponse<IStockItem>>(
    urls.stockItem.delete(params.id),
    params.token
  );
  return response.data;
});

export const fetchStockItem = createAsyncThunk("stockItem/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<IStockItem[]>>(urls.stockItem.list, token);
  return response.data;
});

export const fetchStockItemStatuses = createAsyncThunk(
  "stockItem/status/fetch",
  async (token: string) => {
    const response = await apiGet<ApiResponse<IStockItemStatus[]>>(
      urls.stockItem.statusList,
      token
    );
    return response.data;
  }
);

export const getStockItemById = createAsyncThunk("stockItem/get", async (params: ByIdReq) => {
  const response = await apiGet<ApiResponse<IStockItem>>(
    urls.stockItem.getById(params.id),
    params.token
  );
  return response.data;
});
