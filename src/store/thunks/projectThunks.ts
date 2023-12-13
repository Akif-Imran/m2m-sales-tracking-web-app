import { apiDelete, apiGet, apiPost, apiPut, urls } from "@api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface CreateReq {
  token: string;
  project: {
    name: string;
    description: string;
    type: string;
    contractDate: string;
    deliveryDate: string;
    costing: object | null;
    value: {
      amount: number;
      currency: string;
    };
    status: number;
    customerId: string;
  };
}

interface DeleteReq {
  token: string;
  id: string;
}
interface AssignEngineer {
  token: string;
  projectId: string;
  body: {
    engineer: string;
  };
}

interface StatusReq {
  token: string;
  id: string;
  body: {
    status: number;
    quotation?: {
      quotationDate: string;
      quotationFile: string;
      quotationAmount: number;
    };
  };
}

interface ByIdReq {
  token: string;
  id: string;
}

export const createProject = createAsyncThunk("project/create", async (params: CreateReq) => {
  const response = await apiPost<ApiResponse<IProject>, typeof params.project>(
    urls.project.create,
    params.token,
    params.project
  );
  return response.data;
});

export const removeProject = createAsyncThunk("project/update", async (params: DeleteReq) => {
  const response = await apiDelete<ApiResponse<IProject>>(
    urls.project.delete(params.id),
    params.token
  );
  return response.data;
});

export const fetchProjects = createAsyncThunk("project/fetch", async (token: string) => {
  const response = await apiGet<ApiResponse<IProject[]>>(urls.project.list(), token);
  return response.data;
});

export const updateStatusProject = createAsyncThunk(
  "update/status/project",
  async (params: StatusReq) => {
    const response = await apiPut<ApiResponse<IProject>, typeof params.body>(
      urls.project.updateStatus(params.id),
      params.token,
      params.body
    );
    return response.data;
  }
);

export const fetchProjectStatuses = createAsyncThunk(
  "fetch/status/project",
  async (token: string) => {
    const response = await apiGet<ApiResponse<IProjectStatus[]>>(urls.project.statusList, token);
    const data = response.data.data;
    if (data) {
      if (data[data.length - 1].value === 100) {
        data[data.length - 1].id = 6;
      }
    }
    response.data.data = data;
    return response.data;
  }
);

export const getProjectById = createAsyncThunk("project/get", async (params: ByIdReq) => {
  const response = await apiGet<ApiResponse<IProject>>(
    urls.project.getById(params.id),
    params.token
  );
  return response.data;
});

export const assignEngineer = createAsyncThunk(
  "project/assign-engineer",
  async (params: AssignEngineer) => {
    const response = await apiPut<ApiResponse<IProject>, typeof params.body>(
      urls.project.assignEngineer(params.projectId),
      params.token,
      params.body
    );
    return response.data;
  }
);
