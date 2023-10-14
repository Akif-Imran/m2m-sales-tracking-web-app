import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPurchaseRequests = createAsyncThunk(
  "purchaseRequests/fetch",
  async (token: string) => {}
);
