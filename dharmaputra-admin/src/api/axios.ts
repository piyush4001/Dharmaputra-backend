import axios from "axios";
import { API_BASE_URL } from "../config/backend";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// 🔑 ADMIN AUTH INTERCEPTOR
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("admin_token");

  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  return config;
});

export default api;
