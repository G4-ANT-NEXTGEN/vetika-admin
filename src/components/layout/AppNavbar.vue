<template>
  <nav class="main-nav--bg">
    <div class="main-nav">
      <div class="main-nav-start">
        <div class="search-wrapper">
          <i class="bi bi-search search-icon"></i>
          <input type="text" id="searchInput" placeholder="Enter keywords ..." autocomplete="off" required>
        </div>
      </div>
      <div class="main-nav-end">
        <button class="theme-switcher gray-circle-btn" type="button" title="Switch theme" @click="toggleTheme">
          <span class="sr-only">Switch theme</span>
          <i class="bi bi-sun-fill" v-if="!isDarkMode"></i>
          <i class="bi bi-moon-fill" v-else></i>
        </button>

        <div class="notification-wrapper">
          <button class="gray-circle-btn dropdown-btn" title="Notifications" type="button"
            @click="isNotificationOpen = !isNotificationOpen">
            <span class="sr-only">Notifications</span>
            <span class="notification-dot"></span>
            <i class="bi bi-bell" aria-hidden="true"></i>
          </button>
          <ul class="users-item-dropdown notification-dropdown dropdown" :class="{ 'active': isNotificationOpen }">
            <li>
              <button class="notification-item">
                <div class="notification-dropdown-icon info">
                  <i class="bi bi-check-circle-fill"></i>
                </div>
                <div class="notification-dropdown-text">
                  <span class="notification-dropdown__title">System just updated</span>
                  <span class="notification-dropdown__subtitle">The system has been successfully upgraded.</span>
                </div>
              </button>
            </li>
            <li>
              <RouterLink to="/notifications" class="link-to-page">Go to Notifications page</RouterLink>
            </li>
          </ul>
        </div>

        <button class="gray-circle-btn settings-btn" type="button" title="Settings">
          <span class="sr-only">Settings</span>
          <i class="bi bi-gear" aria-hidden="true"></i>
        </button>

        <RouterLink to="/profile" class="nav-user-inline" title="Go to profile">
          <span class="nav-user-img">
            <picture>
              <img :src="avatarSrc" :alt="userDisplayName" @error="onAvatarError">
            </picture>
          </span>
          <span class="nav-user-name">{{ userDisplayName }}</span>
        </RouterLink>

        <button class="gray-circle-btn logout-btn" type="button" title="Log out" @click="handleLogout">
          <span class="sr-only">Log out</span>
          <i class="bi bi-box-arrow-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>
    <div class="layer" :class="{ 'active': isNotificationOpen }" @click="closeAllDropdowns"></div>
  </nav>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

defineProps({
  authToken: {
    type: [String, Object],
    required: false,
    default: null
  }
});

const emit = defineEmits(['toggle-sidebar', 'logout']);

const isDarkMode = ref(localStorage.getItem('darkMode') === 'enabled');
const isNotificationOpen = ref(false);
const defaultAvatar = '/images/profile/profile.png';

const userProfile = ref({
  avatar: '',
  fullname: ''
});

const userDisplayName = computed(() => {
  return userProfile.value.fullname || 'User';
});

const avatarSrc = computed(() => userProfile.value.avatar || defaultAvatar);

const setTheme = (dark) => {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('darkMode', isDarkMode.value ? 'enabled' : 'disabled');
  setTheme(isDarkMode.value);
};

const handleLogout = () => {
  emit('logout');
};

const fetchUserProfile = async () => {
  try {
    await authStore.fetchProfile();
    userProfile.value.avatar = authStore.user.avatar;
    userProfile.value.fullname = authStore.user.full_name;
  } catch (error) {
    console.error('Error fetching profile from store:', error);
  }
};
const onAvatarError = () => {
  userProfile.value.avatar = '';
};

const closeAllDropdowns = () => {
  isNotificationOpen.value = false;
};

onMounted(() => {
  fetchUserProfile();
  setTheme(isDarkMode.value);
});
</script>

<style scoped>
.lang-switcher-wrapper,
.notification-wrapper,
.nav-user-wrapper {
  position: relative;
}

.notification-dropdown-icon {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-dropdown-icon.info {
  background-color: var(--color-primary);
  opacity: 0.1;
  color: var(--color-primary);
}

.notification-dropdown li button,
.notification-dropdown li a {
  display: flex;
  align-items: flex-start;
  background: transparent;
  border: none;
  width: 100%;
  padding: 10px 10px;
  color: var(--color-text);
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s ease-in-out;
}

.notification-dropdown li button:hover,
.notification-dropdown li a:hover {
  background-color: var(--color-hover);
}

.notification-dropdown-text {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
}

.notification-dropdown__title {
  font-weight: 600;
  font-size: 14px;
  color: var(--color-text);
  line-height: 1.3;
}

.notification-dropdown__subtitle {
  font-size: 12px;
  color: var(--color-muted);
  margin-top: 4px;
  line-height: 1.4;
}

.notification-wrapper {
  position: relative;
}

.notification-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2d8cff;
  box-shadow: 0 0 0 2px var(--nav-bg);
}

.link-to-page {
  color: var(--color-primary) !important;
  font-weight: 600;
  text-align: center;
  padding: 10px 12px !important;
  display: block !important;
}

.link-to-page:hover {
  background-color: var(--color-primary);
  opacity: 0.08;
}

.users-item-dropdown {
  min-width: 200px;
}

.users-item-dropdown li a,
.users-item-dropdown li button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--nav-surface);
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  padding: 10px 12px;
  color: var(--color-text);
  text-decoration: none;
  font-size: 14px;
  border-radius: 6px;
  transition: background-color 0.2s ease-in-out;
  background: transparent;
  border: none;
  width: 100%;
  cursor: pointer;
  justify-content: flex-start;
}

.users-item-dropdown li a:hover,
.users-item-dropdown li button:hover {
  background-color: var(--color-hover);
}

.users-item-dropdown li a.danger,
.users-item-dropdown li button.danger {
  color: var(--color-danger);
}

.users-item-dropdown li a.danger:hover,
.users-item-dropdown li button.danger:hover {
  background-color: var(--color-danger);
  opacity: 0.1;
}

.notification-dropdown {
  min-width: 340px;
}

.lang-item {
  background: transparent;
  border: none;
  padding: 8px 10px;
  color: var(--color-text);
  cursor: pointer;
  border-radius: 6px;
  width: 100%;
  text-align: left;
  transition: background-color 0.2s ease-in-out;
  font-size: 14px;
}

.lang-item:hover {
  background-color: var(--color-hover);
}

.notification-item {
  background: transparent;
  border: none;
  cursor: pointer;
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  transition: background-color 0.2s ease-in-out;
}

.nav-user-inline {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--nav-surface);
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.nav-user-inline:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  border-color: var(--color-text);
}

.nav-user-name {
  font-weight: 600;
  color: var(--color-text);
  font-size: 14px;
}

.notification-item:hover {
  background-color: var(--color-hover);
}
</style>
