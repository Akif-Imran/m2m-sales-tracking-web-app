import { urls } from "@api";
import axios from "axios";

export const uploadFile = async (token: string, file: File) => {
  const form = new FormData();
  form.append("file", file, file?.name);
  const response = await axios.postForm<FileUploadResponse>(urls.uploadFile.upload, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
