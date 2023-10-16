import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { addCompany } from "./companySlice";
import { DateTime } from "luxon";
import { addClaim, updateClaimStatus } from "./claimsSlice";
import { addFollowUp } from "./followUpSlice";
import { addLeave, updateLeaveStatus } from "./leaveApplicationSlice";
import { addProject, updateProjectStatus } from "./projectSlice";
import { updatePurchaseRequestStatus } from "./purchaseRequestSlice";
import { modifyTaskStatus } from "./taskSlice";

interface State {
  isLoading: boolean;
  data: INotification[];
  count: number;
  error: null | SerializedError;
}
const initialState: State = {
  data: [],
  count: 0,
  isLoading: false,
  error: null,
};
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    markAsRead: (state, action: PayloadAction<number>) => {
      const index = state.data.findIndex((notification) => notification.id === action.payload);
      state.data[index].isRead = true;
      state.count = state.count - 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addCompany, (state, action) => {
      state.data.push({
        id: Date.now(),
        isRead: false,
        title: "New Company",
        body: `${action.payload.name} has been added.`,
        createdAt: DateTime.now().toJSON() || "",
      });
      state.count = state.count + 1;
    });
    builder.addCase(addProject, (state, action) => {
      state.data.push({
        id: Date.now(),
        isRead: false,
        title: "New Project",
        body: `${action.payload.name} has been added.`,
        createdAt: DateTime.now().toJSON() || "",
      });
      state.count = state.count + 1;
    });
    builder.addCase(addClaim, (state, action) => {
      state.data.push({
        id: Date.now(),
        isRead: false,
        title: "Claim added",
        body: `Claim for ${action.payload.itemName} has been added.`,
        createdAt: DateTime.now().toJSON() || "",
      });
      state.count = state.count + 1;
    });
    //------------------------
    builder.addCase(addFollowUp, (state, action) => {
      state.data.push({
        id: Date.now(),
        isRead: false,
        title: "Follow Up added",
        body: `Follow Up on ${DateTime.fromISO(action.payload.meetingDate)} at ${
          action.payload.meetingPlace
        } has been added.`,
        createdAt: DateTime.now().toJSON() || "",
      });
      state.count = state.count + 1;
    });
    builder.addCase(addLeave, (state, action) => {
      state.data.push({
        id: Date.now(),
        isRead: false,
        title: "New Leave Application",
        body: `Leave application for by user Id: ${action.payload.requestedById}.`,
        createdAt: DateTime.now().toJSON() || "",
      });
      state.count = state.count + 1;
    });
    builder.addCase(updateClaimStatus, (state, action) => {
      state.data.push({
        id: Date.now(),
        isRead: false,
        title: "Claim Status",
        body: `Status updated for Claim with Id: ${action.payload.claimId} to ${action.payload.statusName}.`,
        createdAt: DateTime.now().toJSON() || "",
      });
      state.count = state.count + 1;
    });
    builder.addCase(updateLeaveStatus, (state, action) => {
      state.data.push({
        id: Date.now(),
        isRead: false,
        title: "Leave Application Status",
        body: `Status updated for Leave with Id: ${action.payload.leaveId} to ${action.payload.statusName}.`,
        createdAt: DateTime.now().toJSON() || "",
      });
      state.count = state.count + 1;
    });
    builder.addCase(updateProjectStatus, (state, action) => {
      state.data.push({
        id: Date.now(),
        isRead: false,
        title: "Project Status",
        body: `Status updated for Project with Id: ${action.payload.projectId} to ${action.payload.statusName}.`,
        createdAt: DateTime.now().toJSON() || "",
      });
      state.count = state.count + 1;
    });
    builder.addCase(updatePurchaseRequestStatus, (state, action) => {
      state.data.push({
        id: Date.now(),
        isRead: false,
        title: "Purchase Request Status",
        body: `Status updated for Purchase Request with Id: ${action.payload.purchaseRequestId} to ${action.payload.statusName}.`,
        createdAt: DateTime.now().toJSON() || "",
      });
      state.count = state.count + 1;
    });
    builder.addCase(modifyTaskStatus, (state, action) => {
      state.data.push({
        id: Date.now(),
        isRead: false,
        title: "Task Status",
        body: `Status updated for Task with Id: ${action.payload.taskId} to ${action.payload.statusName}.`,
        createdAt: DateTime.now().toJSON() || "",
      });
      state.count = state.count + 1;
    });
  },
});

export { notificationSlice };
export const { markAsRead } = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
