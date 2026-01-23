import { defineStore } from "pinia";
import api from "@/api/api";
import { ref } from "vue";

export const useSchoolStore = defineStore("school", () => {
  const schools = ref([]);
  const school = ref(null);
  const isLoading = ref(false);

  const fetchSchools = async () => {
    try {
      isLoading.value = true;
      const res = await api.get(`/api/schools?_per_page=100&sortBy=name`);
      schools.value = res.data.data.items;
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
      const res = await api.post(`/api/schools`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const editSchool = async (id, payload) => {
    try {
      const res = await api.put(`/api/schools/${id}`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const deleteSchool = async (id) => {
    try {
      const res = await api.delete(`/api/schools/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  return {
    schools,
    isLoading,
    school,
    fetchSchools,
    fetchSchoolById,
    createSchool,
    editSchool,
    deleteSchool,
  };
});
