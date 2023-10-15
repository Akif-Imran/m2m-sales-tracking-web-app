import { apiDelete, apiGet, apiPost, apiPut, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface BaseRecord {
  projectId: string;
  customerId: string;
  supplierId: string;
  itemName: string;
  itemType: string;
  quantity: number;
  warranty: string;
  price: {
    amount: number;
    currency: string;
  };
  remarks: string;
  status: number;
}
interface CreateReq {
  token: string;
  claim: BaseRecord;
}
interface UpdateReq {
  token: string;
  id: string;
  claim: BaseRecord;
}

interface DeleteReq {
  token: string;
  id: string;
}

interface ByIdReq {
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

export const createClaim = createAsyncThunk("claim/create", async (params: CreateReq) => {
  const response = await apiPost<ApiResponse<IClaim>, typeof params.claim>(
    urls.claims.create,
    params.token,
    params.claim
  );
  return response.data;
});

export const updateClaim = createAsyncThunk("claim/update", async (params: UpdateReq) => {
  const response = await apiPut<ApiResponse<IClaim>, typeof params.claim>(
    urls.claims.update(params.id),
    params.token,
    params.claim
  );
  return response.data;
});

export const removeClaim = createAsyncThunk("claim/delete", async (params: DeleteReq) => {
  const response = await apiDelete<ApiResponse<IClaim>>(
    urls.claims.delete(params.id),
    params.token
  );
  return response.data;
});

export const fetchClaim = createAsyncThunk("claim/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<IClaim[]>>(urls.claims.list, token);
  return response.data;
});

export const getClaimById = createAsyncThunk("claim/get", async (params: ByIdReq) => {
  const response = await apiGet<ApiResponse<IClaim>>(urls.claims.getById(params.id), params.token);
  return response.data;
});

//TODO - ask yahya to add pending in api and change the req url to standard url
export const fetchClaimStatuses = createAsyncThunk("claim/status/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<IClaimStatus[]>>(urls.claims.statusList, token);
  return response.data;
});

//TODO - ask yahya to add in api
export const updateStatusClaim = createAsyncThunk(
  "claim/status/update",
  async (params: StatusReq) => {
    const response = await apiPut<ApiResponse<IClaim>, typeof params.body>(
      urls.claims.updateStatus(params.id),
      params.token,
      params.body
    );
    return response.data;
  }
);
