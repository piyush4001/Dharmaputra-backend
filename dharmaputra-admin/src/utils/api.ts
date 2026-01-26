import axios from "axios";
import { Platform } from "react-native";
import { getToken } from "@/utils/storage";

const BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:5000/api"
    : "https://uncontrovertible-unincisive-elouise.ngrok-free.dev/api";

console.log("BASE_URL USED BY APP:", BASE_URL);
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["ngrok-skip-browser-warning"] = "true";
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API ERROR:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

// export default api;

// import axios from "axios";
// import { Platform } from "react-native";
// import { getToken } from "../utils/storage";
// import { API_BASE_URL } from "../config/backend";

// const BASE_URL = API_BASE_URL;

// console.log("BASE_URL USED BY APP:", BASE_URL);

// const api = axios.create({
//   baseURL: BASE_URL,
//   timeout: 10000,
// });

// api.interceptors.request.use(
//   async (config) => {
//     const token = await getToken();

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     config.headers["ngrok-skip-browser-warning"] = "true";
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.log("API ERROR:", error?.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

// export default api;

// import axios from "axios";
// import { API_BASE_URL } from "../config/backend";

// const BASE_URL = API_BASE_URL;

// console.log("BASE_URL USED BY APP:", BASE_URL);

// const api = axios.create({
//   baseURL: BASE_URL,
//   timeout: 10000,
// });

// api.interceptors.request.use(
//   async (config) => {
//     const token = localStorage.getItem("adminToken"); // ✅ FIX

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     config.headers["ngrok-skip-browser-warning"] = "true";
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.log("API ERROR:", error?.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

// export default api;
