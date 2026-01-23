import { defineStore } from "pinia";
import api from "@/api/api";
import { ref } from "vue";

export const useDegreeStore = defineStore("degree", () => {
  const degrees = ref([]);
  const degree = ref(null);
  const isLoading = ref(false);

  const fetchDegrees = async () => {
    try {
      isLoading.value = true;
      const res = await api.get(`/api/degrees?_per_page=100&sortBy=name`);
      degrees.value = res.data.data.items;
    } catch (err) {
      console.error("Error fetching degrees:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchDegreeById = async (id) => {
    try {
      const res = await api.get(`/api/degrees/${id}`);
      return res.data.data;
    } catch (err) {
      console.error("Error fetching category:", err);
    }
  };

  const createDegree = async (payload) => {
    try {
      const res = await api.post(`/api/categories`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const editDegree = async (id, payload) => {
    try {
      const res = await api.put(`/api/degrees/${id}`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const deleteDegree = async (id) => {
    try {
      const res = await api.delete(`/api/degrees/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  return {
    degrees,
    isLoading,
    degree,
    fetchDegrees,
    fetchDegreeById,
    createDegree,
    editDegree,
    deleteDegree,
  };
});
