type GetHistoryReportRequest = {
  IMEI: string;
  startDate: string;
  endDate: string;
  page?: number;
};
interface IHistoryReport {
  latitude: string;
  longitude: string;
  mileage: string;
  speed: string;
  gps_accuracy: string;
  gps_time: string;
  createdAt: string;
}
type GetHistoryReportResponse = ApiResponse<IHistoryReport[], "result">;

type GetIgnitionReportRequest = {
  IMEI: string;
  startDate: string;
  endDate: string;
};
interface IIgnitionReport {
  touch_id: null;
  start_time: string;
  end_time: string;
  gps_start_time: string;
  gps_end_time: string;
  start_latitude: string;
  start_longitude: string;
  end_latitude: string;
  end_longitude: string;
  start_mileage: string;
  end_mileage: string;
  total_distance: string;
  duration: number;
  _id: string;
  device_id: number;
  id: number;
  createdAt: string;
  __v: number;
}

type GetIgnitionReportResponse = ApiResponse<IIgnitionReport[], "result">;
