import { apiDelete, apiGet, apiPost, apiPut, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface BaseRecord {
  projectId: string;
  customerId: string;
  contactId: string;
  meetingDate: string;
  meetingPlace: string;
  address: string;
  state: string;
  country: string;
  city: string;
  meetingAgenda: string;
  meetingSummary: string;
  nextMeetingPlace?: string;
  nextMeetingDate?: string;
  nextMeetingAgenda?: string;
  expenseType?: string;
  expenseName?: string;
  expensePrice?: {
    amount: number;
    currency: string;
  };
  expenseDocument?: null | string;
}
interface CreateReq {
  token: string;
  followUp: BaseRecord;
}
interface UpdateReq {
  token: string;
  id: string;
  followup: BaseRecord;
}

interface DeleteReq {
  token: string;
  id: string;
}

interface ByIdReq {
  token: string;
  id: string;
}

export const createFollowUp = createAsyncThunk("followup/create", async (params: CreateReq) => {
  delete params.followUp.expenseDocument;
  const response = await apiPost<ApiResponse<IFollowUp>, typeof params.followUp>(
    urls.followUp.create,
    params.token,
    params.followUp
  );
  return response.data;
});

export const updateFollowUp = createAsyncThunk("followup/update", async (params: UpdateReq) => {
  const response = await apiPut<ApiResponse<IFollowUp>, typeof params.followup>(
    urls.followUp.update(params.id),
    params.token,
    params.followup
  );
  return response.data;
});

export const removeFollowUp = createAsyncThunk("followup/delete", async (params: DeleteReq) => {
  const response = await apiDelete<ApiResponse<IFollowUp>>(
    urls.followUp.delete(params.id),
    params.token
  );
  return response.data;
});

export const fetchFollowUps = createAsyncThunk("fetch/followups", async (token: string) => {
  const response = await apiGet<ApiResponse<IFollowUp[]>>(urls.followUp.list, token);
  return response.data;
});

export const getFollowUpById = createAsyncThunk("get/followup", async (params: ByIdReq) => {
  const response = await apiGet<ApiResponse<IFollowUp>>(
    urls.followUp.getById(params.id),
    params.token
  );
  return response.data;
});
