import { apiDelete, apiPost, apiPut, urls } from "@api";

export const apiLogin = async (body: LoginRequest) => {
  const response = await apiPost<LoginResponse, LoginRequest>(urls.auth.login, "", body);
  const resData = response.data;
  return resData;
};
export const createAccount = async (body: CreateAccountRequest) => {
  const response = await apiPost<MessageResponse, CreateAccountRequest>(
    urls.auth.createAccount,
    "",
    body
  );
  return response.data;
};

export const changePassword = async (token: string, body: ChangePasswordRequest) => {
  const response = await apiPut<ChangePasswordResponse, ChangePasswordRequest>(
    urls.user.changePassword,
    token,
    body
  );
  return response.data;
};

export const deleteAccount = async (token: string) => {
  const response = await apiDelete<MessageResponse>(urls.user.deleteAccount, token);
  return response.data;
};
