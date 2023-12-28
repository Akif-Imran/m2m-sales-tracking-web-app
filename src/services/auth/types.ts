type LoginRequest = {
  email: string;
  password: string;
};

type CreateAccountRequest = {
  name: string;
  email: string;
  password: string;
};
type LoginResponse = ApiResponse<ILoginUserData> & { token: string };

type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

type ChangePasswordResponse = MessageResponse;
