import { apiGet, apiPost, urls } from "@api";
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

export const createContact = createAsyncThunk("create/contact", async (params: CreateReq) => {
  const response = await apiPost<ApiResponse<ICompanyContact>, typeof params.contact>(
    urls.contact.create,
    params.token,
    params.contact
  );
  return response.data;
});

export const fetchAllContacts = createAsyncThunk("fetch/contacts", async (token: string) => {
  const response = await apiGet<ApiResponse<ICompanyContact[]>>(urls.contact.list, token);
  return response.data;
});
