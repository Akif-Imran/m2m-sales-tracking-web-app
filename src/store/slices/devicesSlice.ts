import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";

interface State {
  data: ListResponse<IDevice[]>;
  isLoading: boolean;
  error: null | SerializedError;
}

const initialState: State = {
  data: { count: 0, rows: [] },
  isLoading: false,
  error: null,
};

const devicesSlice = createSlice({
  name: "devices",
  initialState: initialState,
  reducers: {
    crash: (state, action: PayloadAction<ISocketNoMileageObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex((device) => device.IMEI === action.payload.IMEI);
      if (index === -1) return;
      const device = state.data.rows[index];
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.gps_accuracy = data.gps_accuracy;
      device.direction = data.direction;
      device.gps_time = data.gps_time;
      device.speed = data.speed;
      state.data.rows.splice(index, 1, device);
    },
    batteryInfo: (state, action: PayloadAction<ISocketBatteryObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex((device) => device.IMEI === action.payload.IMEI);
      if (index === -1) return;
      const device = state.data.rows[index];
      device.battery_level = data.battery_level;
      device.charging_status = data.charging_status;
      device.current = data.current;
      device.direction = data.direction;
      device.power_capacity = data.power_capacity;
      device.temperature = data.temperature;
      device.voltage = data.voltage;
      state.data.rows.splice(index, 1, device);
    },
    batterLow: (state, action: PayloadAction<ISocketBatteryObj<"low">>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex((device) => device.IMEI === action.payload.IMEI);
      if (index === -1) return;
      const device = state.data.rows[index];
      device.direction = data.direction;
      device.external_power_voltage = data.external_power_voltage;
      device.gps_accuracy = data.gps_accuracy;
      device.gps_time = data.gps_time;
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.speed = data.speed;
      state.data.rows.splice(index, 1, device);
    },
    ignitionOn: (state, action: PayloadAction<ISocketObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex((device) => device.IMEI === action.payload.IMEI);
      if (index === -1) return;
      const device = state.data.rows[index];
      device.direction = data.direction;
      device.gps_accuracy = data.gps_accuracy;
      device.gps_time = data.gps_time;
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.mileage = data.mileage;
      device.speed = data.speed;
      device.is_idling = true;
      device.is_online = 1;
      state.data.rows.splice(index, 1, device);
    },
    ignitionOff: (state, action: PayloadAction<ISocketObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex((device) => device.IMEI === action.payload.IMEI);
      if (index === -1) return;
      const device = state.data.rows[index];
      device.direction = data.direction;
      device.gps_accuracy = data.gps_accuracy;
      device.gps_time = data.gps_time;
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.mileage = data.mileage;
      device.speed = data.speed;
      device.is_idling = false;
      device.is_online = 1;
      state.data.rows.splice(index, 1, device);
    },
    mainPowerOn: (state, action: PayloadAction<ISocketNoMileageObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex((device) => device.IMEI === action.payload.IMEI);
      if (index === -1) return;
      const device = state.data.rows[index];
      device.direction = data.direction;
      device.gps_accuracy = data.gps_accuracy;
      device.gps_time = data.gps_time;
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.speed = data.speed;
      device.is_online = 1;
      state.data.rows.splice(index, 1, device);
    },
    mainPowerOff: (state, action: PayloadAction<ISocketNoMileageObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex((device) => device.IMEI === action.payload.IMEI);
      if (index === -1) return;
      const device = state.data.rows[index];
      device.direction = data.direction;
      device.gps_accuracy = data.gps_accuracy;
      device.gps_time = data.gps_time;
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.speed = data.speed;
      device.is_online = 0;
      state.data.rows.splice(index, 1, device);
    },
    idlingOn: (state, action: PayloadAction<ISocketObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex((device) => device.IMEI === action.payload.IMEI);
      if (index === -1) return;
      const device = state.data.rows[index];
      device.direction = data.direction;
      device.gps_accuracy = data.gps_accuracy;
      device.gps_time = data.gps_time;
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.mileage = data.mileage;
      device.speed = data.speed;
      device.is_idling = true;
      state.data.rows.splice(index, 1, device);
    },
    idlingOff: (state, action: PayloadAction<ISocketObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex((device) => device.IMEI === action.payload.IMEI);
      if (index === -1) return;
      const device = state.data.rows[index];
      device.direction = data.direction;
      device.gps_accuracy = data.gps_accuracy;
      device.gps_time = data.gps_time;
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.mileage = data.mileage;
      device.speed = data.speed;
      device.is_idling = false;
      state.data.rows.splice(index, 1, device);
    },
    virtualIgnitionOn: (state, action: PayloadAction<ISocketObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex((device) => device.IMEI === action.payload.IMEI);
      if (index === -1) return;
      const device = state.data.rows[index];
      device.direction = data.direction;
      device.gps_accuracy = data.gps_accuracy;
      device.gps_time = data.gps_time;
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.mileage = data.mileage;
      device.speed = data.speed;
      device.is_ignition = false;
      state.data.rows.splice(index, 1, device);
    },
    virtualIgnitionOff: (state, action: PayloadAction<ISocketObj>) => {
      const data = action.payload;
      const index = state.data.rows.findIndex((device) => device.IMEI === action.payload.IMEI);
      if (index === -1) return;
      const device = state.data.rows[index];
      device.direction = data.direction;
      device.gps_accuracy = data.gps_accuracy;
      device.gps_time = data.gps_time;
      device.latitude = data.latitude;
      device.longitude = data.longitude;
      device.mileage = data.mileage;
      device.speed = data.speed;
      device.is_ignition = false;
      state.data.rows.splice(index, 1, device);
    },
  },
});

export { devicesSlice };
export const {
  crash,
  batteryInfo,
  batterLow,
  ignitionOn,
  ignitionOff,
  mainPowerOn,
  mainPowerOff,
  idlingOn,
  idlingOff,
  virtualIgnitionOn,
  virtualIgnitionOff,
} = devicesSlice.actions;
export const devicesReducer = devicesSlice.reducer;
