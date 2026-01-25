import { defineStore } from "pinia";
import api from "@/api/api";
import { ref } from "vue";

export const useDegreeStore = defineStore("degree", () => {
  const degrees = ref([]);
  const degree = ref(null);
  const isLoading = ref(false);
  const isProcessing = ref(false);

  const fetchDegrees = async (options = {}) => {
    const { force = false } = options;
    if (!force && degrees.value.length > 0) return;

    try {
      isLoading.value = true;
      const res = await api.get(`/api/degrees`);
      const data = res.data?.data?.items || res.data?.data || res.data || [];
      degrees.value = [...data].sort((a, b) => b.id - a.id);
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
      console.error("Error fetching degree:", err);
    }
  };

  const createDegree = async (payload) => {
    try {
      isProcessing.value = true;
      const res = await api.post(`/api/degrees`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
    } finally {
      isProcessing.value = false;
    }
  };

  const editDegree = async (id, payload) => {
    try {
      isProcessing.value = true;
      const res = await api.put(`/api/degrees/${id}`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
    } finally {
      isProcessing.value = false;
    }
  };

  const deleteDegree = async (id) => {
    try {
      isProcessing.value = true;
      const res = await api.delete(`/api/degrees/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
    } finally {
      isProcessing.value = false;
    }
  };

  return {
    degrees,
    isLoading,
    isProcessing,
    degree,
    fetchDegrees,
    fetchDegreeById,
    createDegree,
    editDegree,
    deleteDegree,
  };
});
