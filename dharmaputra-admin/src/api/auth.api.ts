import api from "./axios";

// export const adminLoginAPI = (email: string, password: string) => {
//   return api.post("/admin/login", { email, password });
// };
export const adminLogin = async (email: string, password: string) => {
  const res = await fetch("http://localhost:5000/api/admin/login", {
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
