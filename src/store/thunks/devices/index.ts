import { apiGet, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDevices = createAsyncThunk("devices/fetch", async (token: string) => {
  const response = await apiGet(urls.devices.list, token);
  return response.data;
});
