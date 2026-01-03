import axios from "axios";
import { consoleNinja } from "./consoleNinja";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("radreport_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  consoleNinja.info("API request", { url: config.url, method: config.method });
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("radreport_token");
      window.location.href = "/login";
    }
    consoleNinja.error("API error", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
