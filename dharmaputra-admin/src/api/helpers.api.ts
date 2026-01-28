import api from "./axios";

export const getAllHelpersAPI = async () => {
  const res = await api.get("/admin/helpers");
  return res.data;
};

// export const approveHelperAPI = async (id: number) => {
//   return api.post(`/admin/helpers/${id}/approve`);
// };

// export const rejectHelperAPI = async (id: number) => {
//   return api.post(`/admin/helpers/${id}/reject`);
// };
export const approveHelperAPI = (id: string) =>
  api.post(`/admin/helpers/${id}/approve`);

export const rejectHelperAPI = (id: string) =>
  api.post(`/admin/helpers/${id}/reject`);
export const getHelperByIdAPI = async (id: string) => {
  const res = await api.get(`/admin/helpers/${id}`);
  return res.data;
};
export const getHelperById = (id: string) => api.get(`/admin/helpers/${id}`);

export const verifyHelper = (id: string, isVerified: boolean) =>
  api.patch(`/admin/helpers/${id}/verify`, { isVerified });
