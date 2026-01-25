import { defineStore } from "pinia";
import api from "@/api/api";
import { ref } from "vue";

export const useSkillStore = defineStore("skill", () => {
  const skills = ref([]);
  const skill = ref(null);
  const isLoading = ref(false);
  const isProcessing = ref(false);

  const fetchSkills = async (options = {}) => {
    const { force = false } = options;

    // Cache check: Skip if we already have data and not forcing refresh
    if (!force && skills.value.length > 0) return;

    try {
      isLoading.value = true;
      const res = await api.get(`/api/skills`);
      const data = res.data?.data?.items || res.data?.data || res.data || [];
      skills.value = [...data].sort((a, b) => b.id - a.id);
    } catch (err) {
      console.error("Error fetching skills:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchSkillById = async (id) => {
    try {
      const res = await api.get(`/api/skills/${id}`);
      return res.data.data;
    } catch (err) {
      console.error("Error fetching skill:", err);
    }
  };

  const createSkill = async (payload) => {
    try {
      isProcessing.value = true;
      const res = await api.post(`/api/skills`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
    } finally {
      isProcessing.value = false;
    }
  };

  const editSkill = async (id, payload) => {
    try {
      isProcessing.value = true;
      const res = await api.put(`/api/skills/${id}`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
    } finally {
      isProcessing.value = false;
    }
  };

  const deleteSkill = async (id) => {
    try {
      isProcessing.value = true;
      const res = await api.delete(`/api/skills/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
    } finally {
      isProcessing.value = false;
    }
  };

  return {
    skills,
    isLoading,
    isProcessing,
    skill,
    fetchSkills,
    fetchSkillById,
    createSkill,
    editSkill,
    deleteSkill,
  };
});
