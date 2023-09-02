import { apiDelete, apiPost, urls } from "@api";

export const apiLogin = async (body: LoginRequest) => {
  const response = await apiPost<LoginResponse, LoginRequest>(
    urls.auth.login,
    "",
    body
  );
  const resData = response.data;
  return resData;
};

export const changePassword = async (
  token: string,
  body: ChangePasswordRequest
) => {
  const response = await apiPost<ChangePasswordResponse, ChangePasswordRequest>(
    urls.user.changePassword,
    token,
    body
  );
  return response.data;
};

export const deleteAccount = async (token: string) => {
  const response = await apiDelete<MessageResponse>(
    urls.user.deleteAccount,
    token
  );
  return response.data;
};
