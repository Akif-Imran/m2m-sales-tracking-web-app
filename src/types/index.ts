type IUserType = "Admin" | "Sales" | "Driver";
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

interface ICompany {
  logo: string;
  _id: string;
  name: string;
  contactPersonId: string;
  designation: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}
interface IProject {
  logo: string;
  _id: string;
  name: string;
  customerName: string; //company
  projectType: string;
  city: string;
  value: number; //value in RM
  salesPerson: number;
  projectManager: number;
  startDate: string;
  endDate: string;
  status: string;
}
type ITaskStatusType = "Pending" | "Accepted" | "Declined" | "Deployed" | "Completed";
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
