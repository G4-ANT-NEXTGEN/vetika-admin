import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/api/api";

export const useAuthStore = defineStore("auth", () => {

  const token = ref(localStorage.getItem("token"));
  const user = ref(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const login = async (payload) => {
    try {
      const formData = new FormData();
      formData.append('email_or_phone', payload.email);
      formData.append('password', payload.password);

      const res = await api.post("/api/login", formData);
      const resultFlag = res.data?.result;

      if (resultFlag === false || resultFlag === 'false') {
        clearAuth();
        throw new Error(res.data?.message || 'Login failed. Please check your credentials.');
      }

      const tokenValue = res.data?.data?.token;
      if (!tokenValue) {
        clearAuth();
        throw new Error(res.data?.message || 'Login failed. Missing token.');
      }

      token.value = tokenValue;
      localStorage.setItem("token", token.value);

      const lastLoginAt = localStorage.getItem("lastLoginAt");
      if (lastLoginAt) {
        localStorage.setItem("prevLoginAt", lastLoginAt);
      }
      localStorage.setItem("lastLoginAt", new Date().toISOString());

      await fetchProfile();

      // Verify if user has System Admin role
      const hasAdminRole = user.value?.roles?.some(role => role.name === 'System Admin');
      if (!hasAdminRole) {
        clearAuth();
        throw new Error('Unauthorized: Admin access required.');
      }
    } catch (error) {
      const responseData = error?.response?.data;
      let message = error?.message || 'Login failed. Please check your credentials.';

      if (responseData) {
        if (typeof responseData === 'string') {
          message = responseData;
        } else if (responseData.message) {
          message = responseData.message;
        } else if (responseData.error) {
          message = responseData.error;
        } else if (responseData.errors) {
          const firstError = Object.values(responseData.errors).flat()[0];
          if (firstError) message = firstError;
        }
      }

      throw new Error(message);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/me");
      user.value = res.data.data;

      // Ensure user still has System Admin role
      const hasAdminRole = user.value?.roles?.some(role => role.name === 'System Admin');
      if (!hasAdminRole) {
        clearAuth();
        throw new Error('Unauthorized: Admin access required.');
      }
    } catch (error) {
      clearAuth();
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.delete("/api/logout");
    } finally {
      clearAuth();
    }
  };

  const clearAuth = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
  };

  return {
    token,
    user,
    isAuthenticated,

    login,
    fetchProfile,
    logout,
    clearAuth,
  };
});
