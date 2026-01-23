import { defineStore } from "pinia";
import api from "@/api/api";
import { ref } from "vue";

export const useSkillStore = defineStore("skill", () => {
  const skills = ref([]);
  const skill = ref(null);
  const isLoading = ref(false);

  const fetchSkills = async () => {
    try {
      isLoading.value = true;
      const res = await api.get(`/api/skills?_per_page=100&sortBy=name`);
      skills.value = res.data.data.items;
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
      const res = await api.post(`/api/skills`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const editSkill = async (id, payload) => {
    try {
      const res = await api.put(`/api/skills/${id}`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const deleteSkill = async (id) => {
    try {
      const res = await api.delete(`/api/skills/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  return {
    skills,
    isLoading,
    skill,
    fetchSkills,
    fetchSkillById,
    createSkill,
    editSkill,
    deleteSkill,
  };
});
