import { apiDelete, apiGet, apiPost, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface CreateReq {
  token: string;
  company: {
    name: string;
    email: string;
    logo: string | null;
    address: string;
    state: string;
    country: string;
    website: string;
    city: string;
    phone: string;
    joiningDate: string;
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

export const createCompany = createAsyncThunk("add/company", async (params: CreateReq) => {
  const response = await apiPost<ApiResponse<ICompany>, typeof params.company>(
    urls.company.create,
    params.token,
    params.company
  );
  return response.data;
});

export const deleteCompany = createAsyncThunk("update/company", async (params: DeleteReq) => {
  const response = await apiDelete<ApiResponse<ICompany>>(
    urls.company.delete(params.id),
    params.token
  );
  return response.data;
});

export const fetchAllCompanies = createAsyncThunk("fetch/companies", async (token: string) => {
  const response = await apiGet<ApiResponse<ICompany[]>>(urls.company.list, token);
  return response.data;
});

export const getCompanyById = createAsyncThunk("get/company", async (params: ByIdReq) => {
  const response = await apiGet(urls.company.getById(params.id), params.token);
  return response.data;
});
