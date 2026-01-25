import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/api/api";

export const useProfileStore = defineStore("profile", () => {
  const user = ref(null);
  const isLoading = ref(false);
  const isProcessing = ref(false);

  const fetchProfile = async () => {
    isLoading.value = true;
    try {
      const res = await api.get("/api/profile");
      user.value = res.data.data;
      return res.data.data;
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const uploadAvatar = async (file) => {
    isProcessing.value = true;
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await api.post("/api/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchProfile();
      return res.data;
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      throw error;
    } finally {
      isProcessing.value = false;
    }
  };

  const removeAvatar = async () => {
    isProcessing.value = true;
    try {
      const res = await api.delete("/api/profile/avatar");
      await fetchProfile();
      return res.data;
    } catch (error) {
      console.error("Failed to remove avatar:", error);
      throw error;
    } finally {
      isProcessing.value = false;
    }
  };

  const updatePersonalInfo = async (payload) => {
    isProcessing.value = true;
    try {
      const params = new URLSearchParams();
      Object.keys(payload).forEach(key => {
        if (payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
          params.append(key, payload[key]);
        }
      });

      const res = await api.put("/api/profile/info", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      await fetchProfile();
      return res.data;
    } catch (error) {
      console.error("Failed to update personal info:", error);
      throw error;
    } finally {
      isProcessing.value = false;
    }
  };

  const updateProfessionalInfo = async (payload) => {
    isProcessing.value = true;
    try {
      const res = await api.put("/api/profile/professional", payload);
      // Refresh to get nested professional data correctly
      await fetchProfile();
      return res.data;
    } catch (error) {
      console.error("Failed to update professional info:", error);
      throw error;
    } finally {
      isProcessing.value = false;
    }
  };

  const changePassword = async (payload) => {
    isProcessing.value = true;
    try {
      const params = new URLSearchParams();
      params.append("old_pass", payload.old_pass);
      params.append("new_pass", payload.new_pass);
      params.append("new_pass_confirmation", payload.new_pass_confirmation);

      const res = await api.put("/api/profile/change-pass", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      await fetchProfile();
      return res.data;
    } catch (error) {
      console.error("Failed to change password:", error);
      throw error;
    } finally {
      isProcessing.value = false;
    }
  };

  return {
    user,
    isLoading,
    isProcessing,
    fetchProfile,
    uploadAvatar,
    removeAvatar,
    updatePersonalInfo,
    updateProfessionalInfo,
    changePassword,
  };
});
