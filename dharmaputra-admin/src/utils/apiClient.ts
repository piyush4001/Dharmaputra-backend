import { API_BASE_URL } from "../config/backend";

export async function apiClient(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("adminToken");

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}
