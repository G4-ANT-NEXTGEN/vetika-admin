import { defineStore } from "pinia";
import api from "@/api/api";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const users = ref([]);
  const selectedUser = ref(null);
  const isLoading = ref(false);
  const isProcessing = ref(false);
  const usersCache = new Map();
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 20,
  });

  const fetchUsers = async (page = 1, options = {}, force = false) => {
    const { search, name, email } = options;
    const params = { page };
    const hasFilters = !!(search || name || email);
    const cacheKey = JSON.stringify({ page, search: search || "", name: name || "", email: email || "" });

    if (search) params.search = search;
    if (name) params.name = name;
    if (email) params.email = email;

    if (!force && usersCache.has(cacheKey)) {
      const cached = usersCache.get(cacheKey);
      users.value = cached.users;
      pagination.value = cached.pagination;
      return;
    }

    try {
      isLoading.value = true;

      if (hasFilters) {
        users.value = [];
      }
      const res = await api.get("/api/users", { params });

      const data = res.data;
      users.value = data.data || [];

      // Update pagination info
      pagination.value = {
        currentPage: data.current_page || 1,
        lastPage: data.last_page || 1,
        total: data.total || 0,
        perPage: data.per_page || 20,
      };

      usersCache.set(cacheKey, {
        users: users.value,
        pagination: pagination.value,
      });
    } catch (err) {
      console.error("Error fetching users:", err);
      users.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const fetchUserById = async (id) => {
    try {
      const res = await api.get(`/api/users/${id}`);
      return res.data.data;
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const updateUser = async (id, payload) => {
    try {
      isProcessing.value = true;
      const formData = new FormData();

      // Add avatar file if present
      if (payload.avatar instanceof File) {
        formData.append('avatar', payload.avatar);
      }

      // Add cover file if present
      if (payload.cover instanceof File) {
        formData.append('cover', payload.cover);
      }

      // Add other fields
      Object.keys(payload).forEach(key => {
        if (key !== 'avatar' && key !== 'cover' && payload[key] !== undefined && payload[key] !== null) {
          formData.append(key, payload[key]);
        }
      });

      const res = await api.post(`/api/users/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      usersCache.clear();
      return res.data;
    } catch (err) {
      console.error("Error updating user:", err);
    } finally {
      isProcessing.value = false;
    }
  };

  const deleteUser = async (id) => {
    try {
      isProcessing.value = true;
      const res = await api.delete(`/api/users/${id}`);
      usersCache.clear();
      return res.data;
    } catch (err) {
      console.error("Error deleting user:", err);
    } finally {
      isProcessing.value = false;
    }
  };

  return {
    users,
    selectedUser,
    isLoading,
    isProcessing,
    pagination,
    fetchUsers,
    fetchUserById,
    updateUser,
    deleteUser,
  };
});
