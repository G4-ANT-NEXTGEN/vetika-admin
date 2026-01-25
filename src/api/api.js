import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const api = axios.create({
  baseURL: import.meta.env.DEV ? "" : import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();

  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }

  return config;
});

// Global Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle Unauthorized errors (Token expired or invalid)
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore();

      // Prevent infinite loops if the error occurs on the login page itself
      if (!window.location.pathname.includes('/login')) {
        authStore.clearAuth();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
