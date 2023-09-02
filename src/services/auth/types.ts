type LoginRequest = {
  email: string;
  password: string;
};
type LoginResponse = ApiResponse<ILoginUserData> & { token: string };

type ChangePasswordRequest = {
  old_password: string;
  new_password: string;
};

type ChangePasswordResponse = MessageResponse;
