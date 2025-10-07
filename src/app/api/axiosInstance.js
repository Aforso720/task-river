// api/axiosInstance.js
import axios from "axios";
import { tokenStorage } from "@shared/lib/tokenStorage";
import { tokenManager } from "@shared/lib/tokenManager";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// добавляем токен
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (e) => Promise.reject(e)
);

// единообразная реакция на 401
axiosInstance.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401) {
      tokenManager.clear();
      // по желанию: window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
