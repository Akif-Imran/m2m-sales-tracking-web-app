type IUserType = "Admin" | "Sales" | "Driver";
interface IUserAccountType {
  id: number;
  name: string;
}
interface IUser {
  avatar: string;
  id: number;
  firstName: string;
  lastName: string;
  companyId: number;
  email: string;
  password: string;
  phone: string;
  departmentId: number;
  departmentName: string;
  address: string;
  city: string;
  country: string;
  userTypeId: number;
  userTypeName: string;
}
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

interface ICompanyContact {
  id: number;
  name: string;
  designation: string;
  email: string;
  phone: string;
  companyId: number;
}
interface ICompany {
  id: number;
  logo: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contact: {
    name: string;
    designation: string;
    email: string;
    phone: string;
  };
  city: string;
  country: string;
}
interface IProjectStatus {
  id: number;
  name: string;
}
interface IProject {
  logo: string;
  id: number;
  name: string;
  companyId: number; //company
  projectType: string;
  city: string;
  value: number; //value in RM
  salesPerson: number;
  projectManager: number;
  startDate: string;
  endDate: string;
  statusId: string;
  statusName: string;
}
interface ITaskStatus {
  id: number;
  name: string;
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

interface IDepartmentType {
  id: number;
  name: string;
}
