import { defineStore } from "pinia";
import api from "@/api/api";
import { ref } from "vue";

export const useSchoolStore = defineStore("school", () => {
  const schools = ref([]);
  const school = ref(null);
  const isLoading = ref(false);
  const isProcessing = ref(false);

  const fetchSchools = async (options = {}) => {
    const { force = false } = options;
    if (!force && schools.value.length > 0) return;

    try {
      isLoading.value = true;
      const res = await api.get(`/api/schools`);
      const data = res.data?.data?.items || res.data?.data || res.data || [];
      schools.value = [...data].sort((a, b) => b.id - a.id);
    } catch (err) {
      console.error("Error fetching schools:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchSchoolById = async (id) => {
    try {
      const res = await api.get(`/api/schools/${id}`);
      return res.data.data;
    } catch (err) {
      console.error("Error fetching school:", err);
    }
  };

  const createSchool = async (payload) => {
    try {
      isProcessing.value = true;
      const res = await api.post(`/api/schools`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
    } finally {
      isProcessing.value = false;
    }
  };

  const editSchool = async (id, payload) => {
    try {
      isProcessing.value = true;
      const res = await api.put(`/api/schools/${id}`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
    } finally {
      isProcessing.value = false;
    }
  };

  const deleteSchool = async (id) => {
    try {
      isProcessing.value = true;
      const res = await api.delete(`/api/schools/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
    } finally {
      isProcessing.value = false;
    }
  };

  return {
    schools,
    isLoading,
    isProcessing,
    school,
    fetchSchools,
    fetchSchoolById,
    createSchool,
    editSchool,
    deleteSchool,
  };
});
