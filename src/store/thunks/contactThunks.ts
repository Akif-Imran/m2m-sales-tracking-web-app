import { apiDelete, apiGet, apiPost, apiPut, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface CreateReq {
  token: string;
  contact: {
    name: string;
    email: string;
    businessCard: string;
    designation: string;
    department: string;
    mobile: string;
    customerId: string;
  };
}
interface UpdateReq {
  token: string;
  id: string;
  contact: {
    name: string;
    email: string;
    businessCard: string;
    designation: string;
    department: string;
    mobile: string;
    customerId: string;
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

export const createContact = createAsyncThunk("contact/create", async (params: CreateReq) => {
  const response = await apiPost<ApiResponse<ICompanyContact>, typeof params.contact>(
    urls.contact.create,
    params.token,
    params.contact
  );
  return response.data;
});

export const updateContact = createAsyncThunk("contact/update", async (params: UpdateReq) => {
  const response = await apiPut<ApiResponse<ICompanyContact>, typeof params.contact>(
    urls.contact.update(params.id),
    params.token,
    params.contact
  );
  return response.data;
});

export const removeContact = createAsyncThunk("contact/remove", async (params: DeleteReq) => {
  const response = await apiDelete<ApiResponse<ICompanyContact>>(
    urls.contact.delete(params.id),
    params.token
  );
  return response.data;
});

export const fetchContacts = createAsyncThunk("contact/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<ICompanyContact[]>>(urls.contact.list, token);
  return response.data;
});

export const getContactById = createAsyncThunk("contact/get", async (params: ByIdReq) => {
  const response = await apiGet<ApiResponse<ICompanyContact>>(
    urls.contact.getById(params.id),
    params.token
  );
  return response.data;
});
