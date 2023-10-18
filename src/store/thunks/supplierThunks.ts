import { apiDelete, apiGet, apiPost, apiPut, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface CreateReq {
  token: string;
  supplier: {
    name: string;
    email: string;
    mobile: string;
    address: string;
    city: string;
    state: string;
    country: string;
    website: string;
    businessCard: "na";
    designation: "na";
    department: "na";
    customerId: "652506a266869aaf01825588";
  };
}

interface UpdateReq {
  token: string;
  id: string;
  supplier: {
    name: string;
    email: string;
    mobile: string;
    address: string;
    city: string;
    state: string;
    country: string;
    website: string;
    businessCard: "na";
    designation: "na";
    department: "na";
    customerId: "652506a266869aaf01825588";
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

export const createSupplier = createAsyncThunk("supplier/create", async (params: CreateReq) => {
  params.supplier = {
    ...params.supplier,
  };
  const response = await apiPost<ApiResponse<ISupplier>, typeof params.supplier>(
    urls.supplier.create,
    params.token,
    params.supplier
  );
  return response.data;
});

export const updateSupplier = createAsyncThunk("supplier/update", async (params: UpdateReq) => {
  const response = await apiPut<ApiResponse<ISupplier>, typeof params.supplier>(
    urls.supplier.update(params.id),
    params.token,
    params.supplier
  );
  return response.data;
});

export const removeSupplier = createAsyncThunk("supplier/delete", async (params: DeleteReq) => {
  const response = await apiDelete<ApiResponse<ISupplier>>(
    urls.supplier.delete(params.id),
    params.token
  );
  return response.data;
});

export const fetchSuppliers = createAsyncThunk("supplier/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<ISupplier[]>>(urls.supplier.list, token);
  return response.data;
});

export const getSupplierById = createAsyncThunk("supplier/get", async (params: ByIdReq) => {
  const response = await apiGet<ApiResponse<ISupplier>>(
    urls.supplier.getById(params.id),
    params.token
  );
  return response.data;
});
