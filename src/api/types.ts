type MessageResponse = {
  success: boolean;
  message: string;
};
type FailedResponse = {
  success: false;
  message: string;
};

type SuccessResponse<T, Key> = Key extends "data"
  ? {
      success: true;
      data: T;
      message?: string;
    }
  : {
      success: true;
      result: T;
      message?: string;
    };

type ApiResponse<T, Key = "data"> = FailedResponse | SuccessResponse<T, Key>;

type ListResponse<T> = {
  count: number;
  rows: T;
};
