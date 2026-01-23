import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "@/views/DashboardView.vue";
import DashboardLayout from "@/layout/DashboardLayout.vue";
import LoginView from "@/views/LoginView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import SkillView from "@/views/skill/SkillView.vue";
import SchoolView from "@/views/school/SchoolView.vue";
import DegreeView from "@/views/degree/DegreeView.vue";
import SubjectView from "@/views/subject/SubjectView.vue";
import CategoryView from "@/views/category/CategoryView.vue";
import { useAuthStore } from "@/stores/auth.js";
import ProfileView from "@/views/profile/ProfileView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: DashboardLayout,
      children: [
        {
          path: "",
          name: "dashboard",
          component: DashboardView,
          meta: {
            title: "Dashboard",
          },
        },
        {
          path: "skill",
          name: "skill.index",
          component: SkillView,
          meta: {
            title: "Skill List",
          },
        },
        {
          path: "school",
          name: "school.index",
          component: SchoolView,
          meta: {
            title: "School List",
          },
        },
        {
          path: "degree",
          name: "degree.index",
          component: DegreeView,
          meta: {
            title: "Degree List",
          },
        },
        {
          path: "subject",
          name: "subject.index",
          component: SubjectView,
          meta: {
            title: "Subject List",
          },
        },
        {
          path: "category",
          name: "category.index",
          component: CategoryView,
          meta: {
            title: "Category List",
          },
        },
        {
          path: "profile",
          name: "profile.index",
          component: ProfileView,
          meta: {
            title: "Profile",
          },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/:catchAll(.*)",
      name: "page.404",
      component: NotFoundView,
      meta: { title: "404 Not Found" },
    },
  ],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  document.title = to.meta.title ? `${to.meta.title} - My Admin` : "My Admin";

  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchProfile();
    } catch {
      authStore.logout();
      return { name: "login" };
    }
  }

  if (!authStore.isAuthenticated && to.name !== "login") {
    return { name: "login" };
  }
  if (authStore.isAuthenticated && to.name === "login") {
    return { name: "dashboard" };
  }

  return true;
});
export default router;
