type IUserType = "Admin" | "Warehouse" | "Driver" | "Services";
interface ILoginUserData {
  id: number;
  name: string;
  email: string;
  password: string;
  user_type_id: number;
  phone: null;
  address: null;
  state: null;
  country: null;
  company_id: null;
  parent_id: null;
  profile_picture: null;
  fcm_token: null;
  is_active: boolean;
  createdAt: string;
  updatedAt: null;
  user_type: IUserType;
}

interface IDevice {
  id: number;
  IMEI: string;
  device_type_id: number;
  sim_no: string;
  device_name: string;
  user_id: number;
  activation_status: number;
  assigned_at: string;
  activated_at: string;
  expired_at: string;
  warranty_start_date: string;
  warranty_end_date: string;
  group_id: null;
  createdAt: string;
  updatedAt: string;
  device_type: string;
  group_name: string;
  latitude: null | string;
  longitude: null | string;
  external_power_voltage: null | string;
  back_battery_percentage: null;
  mileage: null | string;
  speed: null | string;
  touch_id: null | string;
  gps_accuracy: null | string;
  motion_state: null | string;
  gps_time: string;
  is_idling: boolean;
  is_ignition: boolean;
  ignition_time: string;
  sos_command: number;
  out_command: number;
  direction?: null | string;
  is_faulty: boolean;
  battery_info_time: null | string;
  voltage: null | string;
  current: null | string;
  temperature: null | string;
  power_capacity: null | string;
  battery_level: null | string;
  charging_status: null | string;
  vehicle_id: number;
  vehicle_picture: string;
  vehicle_driver_id: null;
  vehicle_reg_no: string;
  vehicle_icon: string;
  is_online: number;
}

interface IVehicle {
  id: number;
  device_id: number;
  reg_no: string;
  color: string;
  make: string;
  model: string;
  picture: string;
  driver_id: null;
  purchase_date: string;
  rent_start_date: string;
  rent_end_date: string;
  serial_number: string;
  battery_serial_number: string;
  year: number;
  age: string;
  mileage: null | string;
  fuel_type_id: number;
  fuel_capacity: string;
  insurance_company: string;
  insurance_number: string;
  insurance_type: string;
  insurance_expiry_date: string;
  insurance_company_contact?: string;
  icon: string;
  user_id: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  fuel_type_name: string;
  driver_name: string;
  driver_picture: string;
}

interface IService {
  id: number;
  vehicle_id: number;
  type_id: number;
  pictures: string[];
  description: string;
  service_date: string;
  status_id: number;
  user_id: number;
  updated_by: null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  vehicle_reg_no: string;
  user_name: string;
  type_name: string;
  status: string;
}

interface IServiceType {
  id: number;
  type_name: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string | null;
}

interface IServiceStatus {
  id: number;
  status_name: string;
  is_active: boolean;
  createdAt: null;
  updatedAt: null;
}
interface IFuelType {
  id: number;
  name: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: null | string;
}
interface IDriverBase {
  id: number;
  name: string;
  ic_number: string;
  picture: string;
  touch_id: string;
  mobile_number: string;
  joining_date: string;
  experience_in_year: number;
  license_type: string;
  license_number: string;
  license_expiry: string;
  department: string;
  created_by: number;
  user_id: number;
  is_active: boolean;
  assign_status: boolean;
  dob: string;
  rating: number;
  available_status: boolean;
  createdAt: string;
  updatedAt: string;
  email: string;
  password: string;
}

type IDriver<T extends "List" | "Add" = "List"> = T extends "Add"
  ? IDriverBase
  : Omit<IDriverBase, "assign_status"> & {
      assign: boolean;
      start_date_time: null;
      end_date_time: null;
    };

interface IGetAssignedVehicle {
  driver_id: number;
  IMEI: string;
  vehicle_id: number;
  vehicle_device_id: number;
  vehicle_reg_no: string;
  vehicle_color: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_picture: string;
  vehicle_driver_id: null;
  vehicle_purchase_date: string;
  vehicle_rent_start_date: string;
  vehicle_rent_end_date: string;
  vehicle_serial_number: string;
  vehicle_battery_serial_number: string;
  vehicle_year: number;
  vehicle_age: string;
  vehicle_fuel_type_id: number;
  vehicle_fuel_capacity: string;
  vehicle_insurance_company: string;
  vehicle_insurance_number: string;
  vehicle_insurance_type: string;
  vehicle_insurance_expiry_date: string;
  vehicle_mileage: null;
  vehicle_icon: string;
  vehicle_user_id: number;
  vehicle_is_active: true;
  vehicle_createdAt: string;
  vehicle_updatedAt: string;
}

interface IPOI {
  id: number;
  poi_type: number;
  poi_name: string;
  latitude: string;
  longitude: string;
  color: string;
  address: string;
  marker_shape: string;
  zone_id: number;
  user_id: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ICircle {
  id: number;
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  name: string;
}

interface IGeoFence {
  id: number;
  display_name: string;
  latitude: string;
  longitude: string;
  radius: string;
  device_id: number;
  is_enabled: number;
  alert_enter: number;
  alert_exit: number;
  user_id: number;
  createdAt: string;
  updatedAt: string;
}

interface INotification {
  title: string;
  body: string;
  IMEI: string;
  driver: boolean;
  service: boolean;
  fcm_token: string[];
  createdAt: string;
  _id: string;
  data: Record<string, number | string | boolean | null>;
  __v: number;
}

interface IDriverActivity {
  id: number;
  behavior_date: string;
  description: string;
  event_type: string;
  EventType: {
    name: string;
  };
}

interface IChecklist {
  id: number;
  name: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string | null;
}

interface QRScanDeviceDetails {
  id: number;
  IMEI: string;
  device_type_id: number;
  sim_no: string;
  device_name: string;
  user_id: number;
  activation_status: number;
  assigned_at: string;
  activated_at: string;
  expired_at: string;
  warranty_start_date: string;
  warranty_end_date: string;
  group_id: null;
  createdAt: string;
  updatedAt: string;
  device_type: string;
  latitude: null | string;
  longitude: null | string;
  external_power_voltage: null;
  back_battery_percentage: null;
  mileage: null;
  speed: null;
  touch_id: null;
  gps_accuracy: null;
  motion_state: null;
  gps_time: string;
  sos_command: number;
  out_command: number;
  is_faulty: false;
  battery_info_time: null;
  voltage: null;
  current: null;
  temperature: null;
  power_capacity: null;
  battery_level: null;
  charging_status: null;
  vehicle_id: number;
  vehicle_picture: string;
  vehicle_icon: string;
}

interface ITask {
  id: number;
  vehicle_id: number;
  checklist: string;
  start_time: string;
  end_time: null | string;
  user_id: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  vehicle_reg_no: string;
  vehicle_icon: string;
  IMEI: string;
  driver_name: string;
}

interface IPoiCount {
  poi_type: number;
  total: number;
}

interface IServiceCount {
  private: number;
  business: number;
  total: number;
}

interface ICollisionReport {
  name: string;
  date: string;
  location: {
    lat: string;
    lng: string;
  };
  driver_name: string;
}

interface IDriverDropDown {
  image: string;
  label: string;
  value: string;
  description: string;
}

interface IDayTrip {
  device_id: number;
  gps_start_time: string;
  gps_end_time: string;
  total_distance: string;
  start_latitude: string;
  end_latitude: string;
  start_longitude: string;
  end_longitude: string;
  duration: number;
  touch_id: null | number;
  start_time: string;
  end_time: string;
  start_mileage: string;
  end_mileage: string;
  _id: string;
  id: number;
  createdAt: string;
  __v: number;
}
interface ITripDetail {
  id: number;
  journey_id: number;
  device_id: number;
  latitude: string;
  longitude: string;
  mileage: string;
  speed: string;
  gps_accuracy: string;
  gps_time: string;
  direction: string;
  is_alarm: true;
  command_type_id: number;
  createdAt: string;
}

type ITripDates = string[];

interface ISocketObj {
  command_type_id: number;
  IMEI: string;
  speed: string;
  direction: string;
  longitude: string;
  latitude: string;
  mileage: string;
  gps_time: string;
  gps_accuracy: string;
}
type ISocketNoMileageObj = Omit<ISocketObj, "mileage">;
type ISocketBatteryObj<T extends "info" | "low" = "info"> = T extends "info"
  ? {
      command_type_id: number;
      voltage: string;
      IMEI: string;
      current: string;
      power_capacity: string;
      charging_status: string;
      temperature: string;
      direction: string;
      battery_level: string;
    }
  : Omit<ISocketObj, "mileage"> & { external_power_voltage: string };
