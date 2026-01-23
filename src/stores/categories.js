import { defineStore } from "pinia";
import api from "@/api/api";
import { ref } from "vue";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref([]);
  const category = ref(null);
  const isLoading = ref(false);

  const fetchCategories = async () => {
    try {
      isLoading.value = true;
      const res = await api.get(`/api/categories?_per_page=100&sortBy=name`);
      categories.value = res.data.data.items;
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
      const res = await api.post(`/api/categories`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const editCategory = async (id, payload) => {
    try {
      const res = await api.put(`/api/categories/${id}`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await api.delete(`/api/categories/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  return {
    categories,
    isLoading,
    category,
    fetchCategories,
    fetchCategoryById,
    createCategory,
    editCategory,
    deleteCategory,
  };
});
