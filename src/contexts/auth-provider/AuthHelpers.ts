import { MODULE_SLICE_STORAGE_KEY } from "@constants";
import type { AuthModel } from "../types";
import type { AxiosStatic } from "axios";

const AUTH_LOCAL_STORAGE_KEY = "m2m-sales-tracking-auth";
const getAuth = async (): Promise<AuthModel | undefined> => {
  if (!localStorage) {
    return;
  }

  const lsValue: string | null = await localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
  if (!lsValue) {
    return;
  }

  try {
    const auth: AuthModel = JSON.parse(lsValue) as AuthModel;
    if (auth) {
      // You can easily check auth_token expiration also
      return auth;
    }
  } catch (error) {
    console.error("AUTH ASYNC STORAGE PARSE ERROR", error);
  }
  return;
};

const setAuth = async (auth: AuthModel) => {
  if (!localStorage) {
    return;
  }

  try {
    const lsValue = JSON.stringify(auth);
    await localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue);
  } catch (error) {
    console.error("AUTH ASYNC STORAGE SAVE ERROR", error);
  }
};

const removeAuth = async () => {
  if (!localStorage) {
    return;
  }
  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
    localStorage.removeItem(MODULE_SLICE_STORAGE_KEY);
  } catch (error) {
    console.error("AUTH LOCAL STORAGE REMOVE ERROR", error);
  }
};

export function setupAxios(axios: AxiosStatic) {
  axios.defaults.headers.common.Accept = "application/json";
  axios.defaults.headers.common["Content-Type"] = "application/json";
  //request interceptor
  axios.interceptors.request.use(
    (config) => {
      getAuth().then((auth) => {
        if (auth && auth.token) {
          console.log("axios setup", auth.token);
          config.headers.Authorization = `Bearer ${auth.token}`;
          //@ts-expect-error config.retry custom retry logic later changed to axios-retry package
          config.retry = 3;
          //@ts-expect-error custom retry logic later changed to axios-retry package
          config.retryDelay = 3000;
        }
      });
      return config;
    },
    (err: unknown) => Promise.reject(err)
  );
  //response interceptor
  axios.interceptors.response.use(undefined, (error) => {
    const { config, message } = error;
    if (!config || !config.retry) {
      return Promise.reject(error);
    }
    // retry while Network timeout or Network Error
    if (!(message.includes("timeout") || message.includes("Network Error"))) {
      return Promise.reject(error);
    }
    config.retry -= 1;
    const delayRetryRequest = new Promise((resolve) => {
      setTimeout(() => {
        console.log("retry the request", config.url);
        resolve(0);
      }, config.retryDelay || 3000);
    });
    return delayRetryRequest.then(() => axios.request(config));
  });
}

export { getAuth, setAuth, removeAuth, AUTH_LOCAL_STORAGE_KEY };
