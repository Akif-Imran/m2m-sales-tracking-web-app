import { apiDelete, apiGet, apiPost, apiPut, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface CreateReq {
  token: string;
  category: {
    name: string;
    description: string;
  };
}

interface UpdateReq {
  token: string;
  id: string;
  category: {
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

export const createPurchaseCategory = createAsyncThunk(
  "category/create",
  async (params: CreateReq) => {
    const response = await apiPost<ApiResponse<IPurchaseCategory>, typeof params.category>(
      urls.purchaseCategory.create,
      params.token,
      params.category
    );
    return response.data;
  }
);

export const updatePurchaseCategory = createAsyncThunk(
  "category/update",
  async (params: UpdateReq) => {
    const response = await apiPut<ApiResponse<IPurchaseCategory>, typeof params.category>(
      urls.purchaseCategory.update(params.id),
      params.token,
      params.category
    );
    return response.data;
  }
);

export const removePurchaseCategory = createAsyncThunk(
  "category/delete",
  async (params: DeleteReq) => {
    const response = await apiDelete<ApiResponse<IPurchaseCategory>>(
      urls.purchaseCategory.delete(params.id),
      params.token
    );
    return response.data;
  }
);

export const fetchPurchaseCategory = createAsyncThunk("category/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<IPurchaseCategory[]>>(
    urls.purchaseCategory.list(),
    token
  );
  return response.data;
});

export const getPurchaseCategoryById = createAsyncThunk("category/get", async (params: ByIdReq) => {
  const response = await apiGet<ApiResponse<IPurchaseCategory>>(
    urls.purchaseCategory.getById(params.id),
    params.token
  );
  return response.data;
});
