type IDropDownList = { value: string; label: string }[];
interface IUserAccountType {
  id: number;
  name: string;
}
interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  userType: number;
  isActive: boolean;
  company: string;
  __v: number;
  createdAt: string;
}
type ILoginUserData = Omit<IUser, "createdAt">;

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
  _id: string; //
  isActive: boolean; //
  company: string; //
  name: string; //
  logo: string | null; //
  address: string; //
  city: string; //
  state: string; //
  country: string; //
  website: string; //
  email: string; //
  phone: string; //
  __v: number; //
  // id: number;
  // logo: string;
  // name: string;
  // email: string;
  // phone: string;
  // address: string;
  // city: string;
  // state: string;
  // country: string;
  // website: string;
  // primaryContactId: number;
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
interface IFollowUp {
  id: number;
  projectId: number;
  contactPersonId: number;
  followUpPersonId: number;
  meetingDate: string;
  meetingPlace: string;
  address: string;
  city: string;
  state: string;
  country: string;
  meetingAgenda: string;
  meetingSummary: string;
  nextFollowUp: {
    place: string;
    meetingDate: string;
    meetingAgenda: string;
  };
  expenses: {
    type: string;
    name: string;
    amount: {
      currency: string;
      amount: number;
    };
    receipt: string;
  };
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
  companyId: number;
}
interface INotification {
  id: number;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

interface IDepartmentType {
  id: number;
  name: string;
}

interface IPurchaseRequestStatus {
  id: number;
  name: string;
}
interface IPurchaseRequest {
  id: number;
  requestedById: number; //user id
  projectId: number;
  itemName: string;
  itemType: string;
  warranty: string; //date
  qty: number;
  supplierId: number;
  price: {
    amount: number;
    currency: string;
  };
  remarks: string;
  statusId: number;
  statusName: string;
}

interface IClaim {
  id: number;
  requestedById: number; //user id
  projectId: number;
  itemName: string;
  itemType: string;
  warranty: string;
  qty: number;
  supplierId: number;
  price: {
    amount: number;
    currency: string;
  };
  remarks: string;
  statusId: number;
  statusName: string;
}
interface ISupplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  websiteURL: string;
}
interface ILeaveType {
  id: number;
  name: string;
}
interface ILeaveStatus {
  id: number;
  name: string;
}

interface ILeaveApplication {
  id: number;
  requestedById: number; //user id
  name: string;
  typeId: number;
  typeName: string;
  reason: string;
  remarks: string;
  startDate: string;
  endDate: string;
  proof: string; //img
  statusId: number;
  statusName: string;
}
