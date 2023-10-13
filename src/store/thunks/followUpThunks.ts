import { apiPost, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface CreateReq {
  token: string;
  followUp: {
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
    nextMeetingPlace: string;
    nextMeetingDate: string;
    nextMeetingAgenda: string;
  };
}
export const createFollowUp = createAsyncThunk("create/followup", async (params: CreateReq) => {
  const response = await apiPost<ApiResponse<IFollowUp>, typeof params.followUp>(
    urls.followUp.create,
    params.token,
    params.followUp
  );
});
