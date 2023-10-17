interface DashCounts {
  total_devices: number;
  online: number;
  offline: number;
  total_vehicles: number;
  total_driver: number;
  driver_available: number;
  driver_unavailable: number;
  operating: number;
  moving: number;
  parked: number;
  faulty: number;
}
type DashCountsResponse = ApiResponse<DashCounts>;

type FileUploadResponse =
  | {
      statusCode: 200 | 201;
      message: string;
      data: string;
      success: true;
    }
  | {
      statusCode: 400 | 500;
      message: string;
      error: string;
    };
