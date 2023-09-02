import { apiGet, urls } from "@api";

export const getDashCounts = async (token: string) => {
  const response = await apiGet<DashCountsResponse>(
    urls.dashboard.counts,
    token
  );
  return response.data;
};
