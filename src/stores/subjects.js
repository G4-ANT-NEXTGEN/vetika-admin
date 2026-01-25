import { defineStore } from "pinia";
import api from "@/api/api";
import { ref } from "vue";

export const useSubjectStore = defineStore("subject", () => {
  const subjects = ref([]);
  const subject = ref(null);
  const isLoading = ref(false);
  const isProcessing = ref(false);

  const fetchSubjects = async (options = {}) => {
    const { force = false } = options;
    if (!force && subjects.value.length > 0) return;

    try {
      isLoading.value = true;
      const res = await api.get(`/api/subjects`);
      const data = res.data?.data?.items || res.data?.data || res.data || [];
      subjects.value = [...data].sort((a, b) => b.id - a.id);
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
      isProcessing.value = true;
      const res = await api.post(`/api/subjects`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
    } finally {
      isProcessing.value = false;
    }
  };

  const editSubject = async (id, payload) => {
    try {
      isProcessing.value = true;
      const res = await api.put(`/api/subjects/${id}`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
    } finally {
      isProcessing.value = false;
    }
  };

  const deleteSubject = async (id) => {
    try {
      isProcessing.value = true;
      const res = await api.delete(`/api/subjects/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
    } finally {
      isProcessing.value = false;
    }
  };

  return {
    subjects,
    isLoading,
    isProcessing,
    subject,
    fetchSubjects,
    fetchSubjectById,
    createSubject,
    editSubject,
    deleteSubject,
  };
});
