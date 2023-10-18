type MessageResponse = {
  success: boolean;
  message: string;
};
type FailedResponse = {
  success: false;
  message: string;
  data: null;
};

type SuccessResponse<T> = {
  statusCode: number;
  message?: string;
  success: true;
  data: T;
};

type ApiResponse<T> = FailedResponse | SuccessResponse<T>;

type ListResponse<T> = {
  count: number;
  rows: T;
};
