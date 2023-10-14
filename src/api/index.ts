import type { AxiosResponse } from "axios";
import axios from "axios";

// export const BASE_URL = "http://www.sealtracking.com:7075";
export const BASE_URL = "http://3.1.140.231:7075";
export const BASE_USER_URL = `${BASE_URL}/user`;
export const BASE_CUSTOMER_URL = `${BASE_URL}/customer`;
export const BASE_CONTACT_URL = `${BASE_URL}/contact`;
export const BASE_PROJECT_URL = `${BASE_URL}/project`;
export const BASE_FOLLOW_UP_URL = `${BASE_URL}/followup`;
export const BASE_SUPPLIER_URL = `${BASE_URL}/supplier`;
export const BASE_REPORT_URL = `${BASE_URL}/app_reports`;
export const MALAYSIA_ZONE = "Asia/Kuala_Lumpur";

export const urls = {
  auth: {
    login: `${BASE_USER_URL}/login`,
  },
  user: {
    list: `${BASE_USER_URL}/getAll`,
    getUserTypes: `${BASE_USER_URL}/getUserTypes`,
    changePassword: `${BASE_USER_URL}/resetPassword`,
    deleteAccount: `${BASE_USER_URL}/deleteAccount`,
  },
  company: {
    list: `${BASE_CUSTOMER_URL}/getAll`,
    create: `${BASE_CUSTOMER_URL}/create`,
    update: (id: string) => `${BASE_CUSTOMER_URL}/update/${id}`,
    delete: (id: string) => `${BASE_CUSTOMER_URL}/delete/${id}`,
    getById: (id: string) => `${BASE_CUSTOMER_URL}/getById/${id}`,
  },
  contact: {
    list: `${BASE_CONTACT_URL}/getAll`,
    create: `${BASE_CONTACT_URL}/create`,
    update: (id: string) => `${BASE_CONTACT_URL}/update/${id}`,
    delete: (id: string) => `${BASE_CONTACT_URL}/delete/${id}`,
    getById: (id: string) => `${BASE_CONTACT_URL}/getById/${id}`,
  },
  project: {
    list: `${BASE_PROJECT_URL}/getAll`,
    create: `${BASE_PROJECT_URL}/create`,
    update: (id: string) => `${BASE_PROJECT_URL}/update/${id}`,
    delete: (id: string) => `${BASE_PROJECT_URL}/delete/${id}`,
    getById: (id: string) => `${BASE_PROJECT_URL}/getById/${id}`,
    statusList: `${BASE_PROJECT_URL}/getStatusList`,
    updateStatus: (id: string) => `${BASE_PROJECT_URL}/changeStatus/${id}`,
  },
  followUp: {
    list: `${BASE_FOLLOW_UP_URL}/getAll`,
    create: `${BASE_FOLLOW_UP_URL}/create`,
    update: (id: string) => `${BASE_FOLLOW_UP_URL}/update/${id}`,
    delete: (id: string) => `${BASE_FOLLOW_UP_URL}/delete/${id}`,
    getById: (id: string) => `${BASE_FOLLOW_UP_URL}/getById/${id}`,
  },
  supplier: {
    list: `${BASE_SUPPLIER_URL}/getAll`,
    create: `${BASE_SUPPLIER_URL}/create`,
    update: (id: string) => `${BASE_SUPPLIER_URL}/update/${id}`,
    delete: (id: string) => `${BASE_SUPPLIER_URL}/delete/${id}`,
    getById: (id: string) => `${BASE_SUPPLIER_URL}/getById/${id}`,
  },
  dashboard: {
    counts: `${BASE_URL}/app_dashboard`,
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

export const apiPut = async <R, P>(
  url: string,
  token: string,
  body: P
): Promise<AxiosResponse<R>> => {
  const response = await axios.put<R>(url, body, {
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
