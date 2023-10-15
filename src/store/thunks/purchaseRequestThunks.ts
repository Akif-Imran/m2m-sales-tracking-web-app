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
  price: number;
  remarks: string;
  status: number;
}
interface CreateReq {
  token: string;
  purchase: BaseRecord;
}
interface UpdateReq {
  token: string;
  id: string;
  purchase: BaseRecord;
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

export const createPurchaseRequest = createAsyncThunk(
  "purchaseRequest/create",
  async (params: CreateReq) => {
    const response = await apiPost<ApiResponse<IPurchaseRequest>, typeof params.purchase>(
      urls.purchaseRequest.create,
      params.token,
      params.purchase
    );
    return response.data;
  }
);

export const updatePurchaseRequest = createAsyncThunk(
  "purchaseRequest/update",
  async (params: UpdateReq) => {
    const response = await apiPut<ApiResponse<IPurchaseRequest>, typeof params.purchase>(
      urls.purchaseRequest.update(params.id),
      params.token,
      params.purchase
    );
    return response.data;
  }
);

export const removePurchaseRequest = createAsyncThunk(
  "purchaseRequest/delete",
  async (params: DeleteReq) => {
    const response = await apiDelete<ApiResponse<IPurchaseRequest>>(
      urls.purchaseRequest.delete(params.id),
      params.token
    );
    return response.data;
  }
);

export const fetchPurchaseRequests = createAsyncThunk(
  "purchaseRequest/fetch",
  async (token: string) => {
    const response = await apiGet<ApiResponse<IPurchaseRequest[]>>(
      urls.purchaseRequest.list,
      token
    );
    return response.data;
  }
);

export const getPurchaseRequestById = createAsyncThunk(
  "purchaseRequest/get",
  async (params: ByIdReq) => {
    const response = await apiGet<ApiResponse<IPurchaseRequest>>(
      urls.purchaseRequest.getById(params.id),
      params.token
    );
    return response.data;
  }
);

//TODO - ask yahya to add pending in api and change the req url to standard url
export const fetchPurchaseRequestStatuses = createAsyncThunk(
  "purchaseRequest/status/fetch",
  async (token: string) => {
    const response = await apiGet<ApiResponse<IPurchaseRequestStatus[]>>(
      urls.purchaseRequest.statusList,
      token
    );
    return response.data;
  }
);

//TODO - ask yahya to add in api
export const updateStatusPurchaseRequest = createAsyncThunk(
  "purchaseRequest/status/update",
  async (params: StatusReq) => {
    const response = await apiPut<ApiResponse<IPurchaseRequest>, typeof params.body>(
      urls.purchaseRequest.updateStatus(params.id),
      params.token,
      params.body
    );
    return response.data;
  }
);
