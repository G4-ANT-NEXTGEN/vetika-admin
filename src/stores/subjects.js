import { defineStore } from "pinia";
import api from "@/api/api";
import { ref } from "vue";

export const useSujectStore = defineStore("subject", () => {
  const subjects = ref([]);
  const subject = ref(null);
  const isLoading = ref(false);

  const fetchSubjects = async () => {
    try {
      isLoading.value = true;
      const res = await api.get(`/api/subjects?_per_page=100&sortBy=name`);
      subjects.value = res.data.data.items;
    } catch (err) {
      console.error("Error fetching subjects:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchSubjectById = async (id) => {
    try {
      const res = await api.get(`/api/subjects/${id}`);
      return res.data.data;
    } catch (err) {
      console.error("Error fetching subject:", err);
    }
  };

  const createSubject = async (payload) => {
    try {
      const res = await api.post(`/api/subjects`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const editSubject = async (id, payload) => {
    try {
      const res = await api.put(`/api/subjects/${id}`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const deleteSubject = async (id) => {
    try {
      const res = await api.delete(`/api/subjects/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  return {
    subjects,
    isLoading,
    subject,
    fetchSubjects,
    fetchSubjectById,
    createSubject,
    editSubject,
    deleteSubject,
  };
});
