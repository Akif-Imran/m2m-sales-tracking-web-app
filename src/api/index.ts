import type { AxiosResponse } from "axios";
import axios from "axios";

export const BASE_URL = "http://www.sealtracking.com:4600";
export const BASE_USER_URL = `${BASE_URL}/user`;
export const BASE_DEVICE_URL = `${BASE_URL}/device`;
export const BASE_VEHICLE_URL = `${BASE_URL}/vehicle`;
export const BASE_GEO_FENCE_URL = `${BASE_URL}/geofence`;
export const BASE_SERVICE_URL = `${BASE_URL}/service`;
export const BASE_DRIVER_URL = `${BASE_URL}/driver`;
export const BASE_REPORT_URL = `${BASE_URL}/app_reports`;
export const MALAYSIA_ZONE = "Asia/Kuala_Lumpur";

export const urls = {
  auth: {
    login: `${BASE_URL}/login`,
  },
  user: {
    changePassword: `${BASE_USER_URL}/resetPassword`,
    deleteAccount: `${BASE_USER_URL}/deleteAccount`,
  },
  dashboard: {
    counts: `${BASE_URL}/app_dashboard`,
  },
  devices: {
    list: `${BASE_DEVICE_URL}/getAll`,
    getDeviceDetails: (imei: string) => `${BASE_DEVICE_URL}/getDeviceDetail?IMEI=${imei}`,
    getById: (deviceId: number) => `${BASE_DEVICE_URL}/getDeviceById?id=${deviceId}`,
    create: `${BASE_DEVICE_URL}/create`,
    createMany: `${BASE_DEVICE_URL}/createMultiple`,
    update: `${BASE_DEVICE_URL}/update`,
  },
  vehicles: {
    list: `${BASE_VEHICLE_URL}/getAll`,
    getById: (vehicleId: string) => `${BASE_VEHICLE_URL}/getVehicleById?id=${vehicleId}`,
    create: `${BASE_VEHICLE_URL}/create`,
    update: `${BASE_VEHICLE_URL}/update`,
    delete: (vehicleId: string) => `${BASE_VEHICLE_URL}/delete?id=${vehicleId}`,
    getFuelTypes: `${BASE_VEHICLE_URL}/getFuelTypes`,
  },
  appReports: {
    historyReport: (IMEI: string, startDate: string, endDate: string, page = 1) =>
      `${BASE_REPORT_URL}/vehicle_history/?IMEI=${IMEI}&startDate=${startDate}&endDate=${endDate}&page=${page}`,
    ignitionReport: (IMEI: string, startDate: string, endDate: string) =>
      `${BASE_REPORT_URL}/ignition/?IMEI=${IMEI}&startDate=${startDate}&endDate=${endDate}`,
  },
  trips: {
    getTripDates: (deviceId: number) => `${BASE_URL}/get_trip_dates/${deviceId}`,
    getDayTrip: (deviceId: number, date: string) =>
      `${BASE_URL}/get_day_trip?device_id=${deviceId}&date=${date}`,
    getTripDetails: (deviceId: number, date: string, journey_id: number) =>
      `${BASE_URL}/get_trip_details?device_id=${deviceId}&date=${date}&journey_id=${journey_id}`,
  },
  geoFence: {
    create: `${BASE_GEO_FENCE_URL}/create`,
    update: `${BASE_GEO_FENCE_URL}/update`,
    list: `${BASE_GEO_FENCE_URL}/getall`,
    getById: (geoFenceId: string) => `${BASE_GEO_FENCE_URL}/getById?id=${geoFenceId}`,
    getByDeviceId: (deviceId: string) =>
      `${BASE_GEO_FENCE_URL}/getAllByDeviceId?device_id=${deviceId}`,
    delete: (geoFenceId: string) => `${BASE_GEO_FENCE_URL}/delete?id=${geoFenceId}`,
  },
  services: {
    counts: `${BASE_SERVICE_URL}/statusCount`,
    list: `${BASE_SERVICE_URL}/getAll`,
    getById: (serviceId: string) => `${BASE_SERVICE_URL}/getServiceById?id=${serviceId}`,
    typeList: `${BASE_SERVICE_URL}/getServiceTypes`,
    statusList: `${BASE_SERVICE_URL}/getAllStatus`,
    updateStatus: `${BASE_SERVICE_URL}/updateStatus`,
    create: `${BASE_SERVICE_URL}/create`,
    delete: (serviceId: string) => `${BASE_SERVICE_URL}/delete?id=${serviceId}`,
  },
  driver: {
    list: `${BASE_DRIVER_URL}/getAll`,
    create: `${BASE_DRIVER_URL}/create`,
    update: `${BASE_DRIVER_URL}/update`,
    assignVehicles: `${BASE_DRIVER_URL}/assignDriver`, //this assigns multiple vehicles to a driver
    getById: (driverId: string) => `${BASE_DRIVER_URL}/getDriverById?id=${driverId}`,
    delete: (driverId: string) => `${BASE_DRIVER_URL}/delete?id=${driverId}`,
    getAssignedVehicles: (driverId: string) =>
      `${BASE_DRIVER_URL}/getAssignedVehiclesByDriverId?driver_id=${driverId}`,
    getBehaviorEventType: `${BASE_DRIVER_URL}/getEventType`,
    addBehavior: `${BASE_DRIVER_URL}/addDriverBehavior`,
    getBehaviorByDriverId: (driverId: string) =>
      `${BASE_DRIVER_URL}/getDriverBehavior?driver_id=${driverId}`,
    addDriverWorkingTime: `${BASE_DRIVER_URL}/addDriverWorkingTime`,
    qrScan: (imei: string) => `${BASE_URL}/user_device_details/${imei}`,
    getCheckList: `${BASE_URL}/get_checklist`,
    addChecklistItem: `${BASE_URL}/add_checklist`,
    updateChecklistItem: `${BASE_URL}/update_checklist`,
    deleteChecklistItem: (checklistItemId: number) =>
      `${BASE_URL}/get_checklist?id=${checklistItemId}`,
    getTaskList: `${BASE_URL}/get_task_list/1`,
    addNewTask: `${BASE_URL}/add_new_task`,
    endTask: `${BASE_URL}/end_task`,
  },
  notifications: {
    list: `${BASE_URL}/notifications`,
  },
};
export const events = {
  authenticated: "authenticated",
  crash: "crash",
  battery: {
    low: "battery_low",
    info: "battery_info",
  },
  ignition: {
    on: "ignition_on",
    off: "ignition_off",
  },
  mainPower: {
    on: "main_power_on",
    off: "main_power_off",
  },
  idling: {
    on: "idling_on",
    off: "idling_off",
  },
  virtualIgnition: {
    on: "virtual_ignition_on",
    off: "virtual_ignition_off",
  },
};

export const apiGet = async <R>(url: string, token: string): Promise<AxiosResponse<R>> => {
  const response = await axios.get<R>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const apiDelete = async <R>(url: string, token: string): Promise<AxiosResponse<R>> => {
  const response = await axios.delete<R>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const apiPost = async <R, P>(
  url: string,
  token: string,
  body: P
): Promise<AxiosResponse<R>> => {
  const response = await axios.post<R>(url, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
