import { apiDelete, apiGet, apiPost, apiPut, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface BaseRecord {
  name: string;
  email: string;
  logo?: string | null;
  address: string;
  state: string;
  country: string;
  website: string;
  city: string;
  phone: string;
}
interface CreateReq {
  token: string;
  company: BaseRecord;
}

interface UpdateReq {
  token: string;
  id: string;
  company: BaseRecord;
}

interface DeleteReq {
  token: string;
  id: string;
}

interface ByIdReq {
  token: string;
  id: string;
}

export const createCompany = createAsyncThunk("company/create", async (params: CreateReq) => {
  const response = await apiPost<ApiResponse<ICompany>, typeof params.company>(
    urls.company.create,
    params.token,
    params.company
  );
  return response.data;
});
export const updateCompany = createAsyncThunk("company/update", async (params: UpdateReq) => {
  const response = await apiPut<ApiResponse<ICompany>, typeof params.company>(
    urls.company.update(params.id),
    params.token,
    params.company
  );
  return response.data;
});

export const removeCompany = createAsyncThunk("company/remove", async (params: DeleteReq) => {
  const response = await apiDelete<ApiResponse<ICompany>>(
    urls.company.delete(params.id),
    params.token
  );
  return response.data;
});

export const fetchAllCompanies = createAsyncThunk("company/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<ICompany[]>>(urls.company.list, token);
  return response.data;
});

export const getCompanyById = createAsyncThunk("company/get", async (params: ByIdReq) => {
  const response = await apiGet(urls.company.getById(params.id), params.token);
  return response.data;
});
