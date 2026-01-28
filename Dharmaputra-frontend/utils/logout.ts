import { removeToken } from "./storage";

export const logout = async () => {
  await removeToken();
};
