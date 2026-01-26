import { removeToken } from "@/utils/storage";

export const logout = async () => {
  await removeToken();
};
