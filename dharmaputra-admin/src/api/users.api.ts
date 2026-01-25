import api from "./axios";

export const getAllUsersAPI = async () => {
  const res = await api.get("/admin/users");
  console.log("USERS API RESPONSE:", res.data);
  return res.data;
};
export const getUserProfileAPI = async (userId: string) => {
  const res = await api.get(`/admin/users/${userId}/profile`);
  return res.data;
};
