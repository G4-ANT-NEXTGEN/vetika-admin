import { defineStore } from "pinia";
import api from "@/api/api";
import { ref } from "vue";

export const useActivityStore = defineStore("activity", () => {
  const isLoading = ref(false);
  const error = ref(null);
  const activities = ref([]);

  const fetchActivities = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      // --- FUTURE ENDPOINT INTEGRATION ---
      // Once you have the endpoint, uncomment the lines below and adjust the URL
      // const res = await api.get("/api/activities");
      // activities.value = res.data?.data || res.data || [];

      // For now, we use high-end mock data to keep the UI looking professional
      activities.value = [
        {
          id: 1,
          type: 'POST',
          badgeColor: 'badge-green',
          title: 'New skill added',
          meta: 'JavaScript ES6 Advanced · Admin',
          time: '2 mins ago'
        },
        {
          id: 2,
          type: 'PUT',
          badgeColor: 'badge-blue',
          title: 'School updated',
          meta: 'MIT University details modified · Admin',
          time: '5 mins ago'
        },
        {
          id: 3,
          type: 'DEL',
          badgeColor: 'badge-red',
          title: 'Degree deleted',
          meta: 'Associate Degree removed · Admin',
          time: '1 hour ago'
        },
        {
          id: 4,
          type: 'POST',
          badgeColor: 'badge-green',
          title: 'Subject created',
          meta: 'Advanced Mathematics · Admin',
          time: '1 day ago'
        },
        {
          id: 5,
          type: 'PUT',
          badgeColor: 'badge-blue',
          title: 'Category modified',
          meta: 'Technology category updated · Admin',
          time: '3 days ago'
        },
      ];
    } catch (err) {
      console.error("Failed to fetch activities:", err);
      error.value = err.message || "Failed to load activities";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    activities,
    fetchActivities,
  };
});
