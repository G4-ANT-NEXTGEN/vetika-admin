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
      const res = await api.post(`/api/categories`, payload);
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
      const res = await api.put(`/api/categories/${id}`, payload);
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
