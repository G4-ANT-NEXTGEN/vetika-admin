<template>
  <div class="page-flex">
    <AppSidebar :authToken="authStore.token" :is-hidden="isSidebarHidden" @toggle-sidebar="toggleSidebar"
      @logout="handleLogout" />

    <div class="sidebar-layer" :class="{ active: !isSidebarHidden }" @click="toggleSidebar"></div>

    <div class="main-wrapper" :class="{ 'sidebar-hidden': isSidebarHidden }">
      <AppNavbar :authToken="authStore.token" :is-hidden="isSidebarHidden" @toggle-sidebar="toggleSidebar"
        @logout="handleLogout" />

      <main class="main">
        <div class="container-fluid">
          <router-view />
        </div>
      </main>

      <footer class="footer">
        <div class="container footer--flex">
          <div class="footer-start">
            <p>2026 © Admin Dashboard VETIKA</p>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import AppSidebar from '../components/layout/AppSidebar.vue'
import AppNavbar from '../components/layout/AppNavbar.vue'

import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'

const authStore = useAuthStore()
const router = useRouter()
const { add: addToast } = useToast()
const confirm = useConfirm()
const isSidebarHidden = ref(false)

const toggleSidebar = () => {
  isSidebarHidden.value = !isSidebarHidden.value
}

const handleLogout = async () => {
  const isConfirmed = await confirm.require({
    title: 'Logout',
    message: 'Are you sure you want to logout?',
    confirmText: 'Logout',
    type: 'danger'
  })

  if (isConfirmed) {
    await authStore.logout()
    addToast({
      message: 'Logged out successfully',
      type: 'success',
      duration: 3000
    })
    router.push('/login')
  }
}
</script>

<style scoped>
.main {
  flex-grow: 1;
  padding: 20px 0;
  background-color: var(--color-background);
}
</style>
