import api from "./axios";

export const getAllHelpersAPI = async () => {
  const res = await api.get("/admin/helpers");
  return res.data;
};

export const approveHelperAPI = async (id: number) => {
  return api.post(`/admin/helpers/${id}/approve`);
};

export const rejectHelperAPI = async (id: number) => {
  return api.post(`/admin/helpers/${id}/reject`);
};
