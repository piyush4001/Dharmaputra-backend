   

// export const adminLoginAPI = (email: string, password: string) => {
//   return api.post("/admin/login", { email, password });
// };
import { API_BASE_URL } from "../config/backend";
export const adminLogin = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json(); // { token, role }
};
