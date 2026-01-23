<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import AppSidebar from '../components/layout/AppSidebar.vue'
import AppNavbar from '../components/layout/AppNavbar.vue'

const authStore = useAuthStore()
const router = useRouter()
const isSidebarHidden = ref(false)

const toggleSidebar = () => {
  isSidebarHidden.value = !isSidebarHidden.value
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="page-flex">
    <!-- Sidebar -->
    <AppSidebar :authToken="authStore.token" :is-hidden="isSidebarHidden" @toggle-sidebar="toggleSidebar" @logout="handleLogout" />

    <div class="main-wrapper" :class="{ 'sidebar-hidden': isSidebarHidden }">
      <!-- Top Navbar -->
      <AppNavbar :authToken="authStore.token" @toggle-sidebar="toggleSidebar" @logout="handleLogout" />

      <!-- Main Content Area -->
      <main class="main">
        <div class="container">
          <slot></slot>
        </div>
      </main>

      <!-- Footer (Optional) -->
      <footer class="footer">
        <div class="container footer--flex">
          <div class="footer-start">
            <p>2026 © Admin Dashboard SMOS</p>
          </div>
          <ul class="footer-end">
            <li><a href="##">About</a></li>
            <li><a href="##">Support</a></li>
            <li><a href="##">Purchase</a></li>
          </ul>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* Component-specific overrides only */
.main {
  flex-grow: 1;
  padding: 30px 0;
  background-color: var(--color-background);
}
</style>
