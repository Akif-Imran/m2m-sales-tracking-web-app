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
type ILoginUserData = IUser;

interface ICompanyContact {
  id: number;
  businessCard: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  mobile: string;
  primary: boolean;
  companyId: number;
}
interface ICompany {
  id: number;
  logo: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  website: string;
  primaryContactId: number;
}
interface IProjectStatus {
  id: number;
  name: string;
}
interface IProject {
  id: number;
  name: string;
  description: string;
  projectType: string;
  value: {
    currency: string;
    amount: number;
  };
  contractDate: string;
  deliveryDate: string;
  quotation: string;
  salesPersonId: number;
  //costing
  statusId: number;
  statusName: string;
  companyId: number; //company
}
interface ITaskStatus {
  id: number;
  name: string;
}
interface ITask {
  id: number;
  projectId: number;
  assigneeId: number;
  title: string;
  description: string;
  createdDate: string;
  plannedEndDate: string;
  completedDate: string;
  statusId: number;
  statusName: string;
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
