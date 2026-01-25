import { defineStore } from "pinia";
import api from "@/api/api";
import { ref, computed } from "vue";

export const useDashboardStore = defineStore("dashboard", () => {
  const isLoading = ref(false);
  const error = ref(null);

  const skills = ref([]);
  const subjects = ref([]);
  const schools = ref([]);
  const degrees = ref([]);
  const categories = ref([]);

  const barChartData = computed(() => [
    { label: "Skills", height: skills.value.length || 0 },
    { label: "Schools", height: schools.value.length || 0 },
    { label: "Degrees", height: degrees.value.length || 0 },
    { label: "Subjects", height: subjects.value.length || 0 },
    { label: "Categories", height: categories.value.length || 0 },
  ]);

  const progressData = computed(() => [
    { label: "Skills Goal", value: Math.min(Math.round((skills.value.length / 50) * 100), 100) },
    { label: "Schools Goal", value: Math.min(Math.round((schools.value.length / 20) * 100), 100) },
    { label: "Degrees Goal", value: Math.min(Math.round((degrees.value.length / 10) * 100), 100) },
    { label: "Subjects Goal", value: Math.min(Math.round((subjects.value.length / 30) * 100), 100) },
  ]);

  const summaryData = computed(() => {
    const total = skills.value.length + schools.value.length + degrees.value.length + subjects.value.length + categories.value.length;
    return {
      dataAccuracy: "100%", // Logic can be added later
      totalRecords: total > 1000 ? (total / 1000).toFixed(1) + 'k' : total.toString()
    };
  });

  const statCardsData = computed(() => [
    { label: "Total Skills", value: skills.value.length, change: 12.5, icon: "bi-lightbulb-fill", iconBg: "blue" },
    { label: "Total Schools", value: schools.value.length, change: 8.2, icon: "bi-building-fill", iconBg: "purple" },
    { label: "Total Degrees", value: degrees.value.length, change: 3.1, icon: "bi-mortarboard-fill", iconBg: "green" },
    { label: "Total Categories", value: categories.value.length, change: 15.3, icon: "bi-folder-fill", iconBg: "yellow" },
  ]);

  const quickActionsData = [
    { label: "Add Skill", sub: "Create new skill", icon: "bi-lightbulb" },
    { label: "Add School", sub: "Register school", icon: "bi-building" },
    { label: "Add Degree", sub: "New degree type", icon: "bi-mortarboard" },
    { label: "Add Subject", sub: "Create subject", icon: "bi-journal" },
    { label: "Add Category", sub: "New category", icon: "bi-folder-plus" },
  ];

  const fetchDashboardData = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const [skillsRes, subjectsRes, schoolsRes, degreesRes, categoriesRes] =
        await Promise.all([
          api.get("/api/skills"),
          api.get("/api/subjects"),
          api.get("/api/schools"),
          api.get("/api/degrees"),
          api.get("/api/categories"),
        ]);

      skills.value = skillsRes.data?.data || skillsRes.data || [];
      subjects.value = subjectsRes.data?.data || subjectsRes.data || [];
      schools.value = schoolsRes.data?.data || schoolsRes.data || [];
      degrees.value = degreesRes.data?.data || degreesRes.data || [];
      categories.value = categoriesRes.data?.data || categoriesRes.data || [];
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      error.value = err.message || "Failed to load dashboard data";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    skills,
    subjects,
    schools,
    degrees,
    categories,
    barChartData,
    progressData,
    summaryData,
    statCardsData,
    quickActionsData,
    fetchDashboardData,
  };
});

