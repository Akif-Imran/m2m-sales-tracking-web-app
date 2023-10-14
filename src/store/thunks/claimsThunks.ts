import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchClaims = createAsyncThunk("claims/fetch", async (token: string) => {});
