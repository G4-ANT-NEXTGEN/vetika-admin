import { defineStore } from "pinia";
import api from "@/api/api";
import { ref } from "vue";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref([]);
  const category = ref(null);
  const isLoading = ref(false);
  const isProcessing = ref(false);

  const fetchCategories = async (options = {}) => {
    const { force = false } = options;
    if (!force && categories.value.length > 0) return;

    try {
      isLoading.value = true;
      const res = await api.get(`/api/categories`);
      const data = res.data?.data?.items || res.data?.data || res.data || [];
      categories.value = [...data].sort((a, b) => b.id - a.id);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchCategoryById = async (id) => {
    try {
      const res = await api.get(`/api/categories/${id}`);
      return res.data.data;
    } catch (err) {
      console.error("Error fetching category:", err);
    }
  };

  const createCategory = async (payload) => {
    try {
      isProcessing.value = true;
      const formData = new FormData();

      // Add image file if present
      if (payload.image instanceof File) {
        formData.append('image', payload.image);
      }

      // Add name field
      if (payload.name) {
        formData.append('name', payload.name);
      }

      // Add any other fields from payload
      Object.keys(payload).forEach(key => {
        if (key !== 'image' && key !== 'name' && payload[key] !== undefined) {
          formData.append(key, payload[key]);
        }
      });

      const res = await api.post(`/api/categories`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (err) {
      console.log(err);
    } finally {
      isProcessing.value = false;
    }
  };

  const editCategory = async (id, payload) => {
    try {
      isProcessing.value = true;
      const formData = new FormData();

      if (payload.image instanceof File) {
        formData.append('image', payload.image);
      }

      if (payload.name) {
        formData.append('name', payload.name);
      }

      Object.keys(payload).forEach(key => {
        if (key !== 'image' && key !== 'name' && payload[key] !== undefined) {
          formData.append(key, payload[key]);
        }
      });

      const res = await api.post(`/api/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (err) {
      console.log(err);
    } finally {
      isProcessing.value = false;
    }
  };

  const deleteCategory = async (id) => {
    try {
      isProcessing.value = true;
      const res = await api.delete(`/api/categories/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
    } finally {
      isProcessing.value = false;
    }
  };

  return {
    categories,
    isLoading,
    isProcessing,
    category,
    fetchCategories,
    fetchCategoryById,
    createCategory,
    editCategory,
    deleteCategory,
  };
});
