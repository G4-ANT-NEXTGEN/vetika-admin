<template>
  <aside class="sidebar" :class="{ 'hidden': isHidden }">
    <div class="sidebar-start">
      <div class="sidebar-head">
        <RouterLink to="/" class="logo-wrapper" title="Home">
          <span class="sr-only">Home</span>
          <img src="/logo.png" alt="logo" class="logo-icon" />
          <div class="logo-text">
            <span class="logo-title">Admin</span>
            <span class="logo-subtitle">Dashboard</span>
          </div>
        </RouterLink>
        <button class="sidebar-toggle transparent-btn" title="Menu" type="button" @click="$emit('toggle-sidebar')">
          <span class="sr-only">Toggle menu</span>
          <i class="bi" :class="isHidden ? 'bi-chevron-right' : 'bi-chevron-left'" aria-hidden="true"></i>
        </button>
      </div>
      <div class="sidebar-body">
        <ul class="sidebar-body-menu">
          <li>
            <RouterLink :class="{ active: isActive('/') }" to="/"><i class="bi bi-house-fill"
                aria-hidden="true"></i><span>Dashboard</span></RouterLink>
          </li>
          <li>
            <button class="show-cat-btn" type="button" :class="{ active: isSettingsActive }" @click="toggleSettings">
              <span class="d-flex align-items-center">
                <i class="bi bi-gear-fill" aria-hidden="true"></i>
                <span>Settings</span>
              </span>
              <span class="category__btn" :class="{ rotated: isSettingsOpen }" aria-hidden="true">
                <i class="bi bi-chevron-down"></i>
              </span>
            </button>
            <ul class="cat-sub-menu" :class="{ visible: isSettingsOpen }">
              <li>
                <RouterLink :class="{ active: isActive('/skill') }" to="/skill"><i class="bi bi-lightbulb-fill"
                    aria-hidden="true"></i><span>Skills</span></RouterLink>
              </li>
              <li>
                <RouterLink :class="{ active: isActive('/school') }" to="/school"><i class="bi bi-building"
                    aria-hidden="true"></i><span>Schools</span></RouterLink>
              </li>
              <li>
                <RouterLink :class="{ active: isActive('/degree') }" to="/degree"><i class="bi bi-mortarboard-fill"
                    aria-hidden="true"></i><span>Degrees</span></RouterLink>
              </li>
              <li>
                <RouterLink :class="{ active: isActive('/subject') }" to="/subject"><i class="bi bi-book-fill"
                    aria-hidden="true"></i><span>Subjects</span></RouterLink>
              </li>
              <li>
                <RouterLink :class="{ active: isActive('/category') }" to="/category"><i class="bi bi-folder-fill"
                    aria-hidden="true"></i><span>Categories</span></RouterLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="sidebar-footer">
      <div class="sidebar-category">ACCOUNT</div>
      <ul class="sidebar-body-menu">
        <li>
          <RouterLink :class="{ active: isActive('/profile') }" to="/profile">
            <i class="bi bi-person-fill" aria-hidden="true"></i>
            <span>Profile</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink :class="{ active: isActive('/help') }" to="/help"><i class="bi bi-question-circle-fill"
              aria-hidden="true"></i><span>Help & Support</span></RouterLink>
        </li>
        <li>
          <button @click="$emit('logout')" class="text-danger"><i class="bi bi-box-arrow-right"
              aria-hidden="true"></i><span>Logout</span></button>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

defineProps({
  authToken: {
    type: [String, Object], // Object encompasses null in some contexts, or just remove type check strictly? Vue 3 supports [String, null]
    required: false,
    default: null
  },
  isHidden: {
    type: Boolean,
    default: false
  }
});

defineEmits(['toggle-sidebar', 'logout']);

const route = useRoute();

const isSettingsOpen = ref(false);
const settingsPaths = ['/skill', '/school', '/degree', '/subject', '/category'];

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path === path || route.path.startsWith(`${path}/`);
};

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value;
};

const isSettingsActive = computed(() => settingsPaths.some((path) => isActive(path)));

watch(
  () => route.path,
  () => {
    if (isSettingsActive.value) {
      isSettingsOpen.value = true;
    }
  },
  { immediate: true }
);

</script>

<style scoped>
.logo-icon {
  width: 38px;
  height: 38px;
  object-fit: contain;
  flex-shrink: 0;
  transition: all 0.3s ease;
  border-radius: 50%;
}

.category__btn i {
  font-size: 0.875rem;
}

.show-cat-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: transparent;
  border: none;
  padding: 11px 12px;
  color: var(--sidebar-text);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
  margin-bottom: 4px;
}

.show-cat-btn:hover {
  background-color: var(--sidebar-hover);
}

.show-cat-btn.active {
  background-color: var(--sidebar-active);
  color: var(--sidebar-text);
}

.show-cat-btn .bi {
  margin-right: 10px;
  font-size: 1.125rem;
}

.category__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease-in-out;
}

.category__btn.rotated {
  transform: rotate(180deg);
}

.cat-sub-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
}

.cat-sub-menu.visible {
  max-height: 300px;
}

.cat-sub-menu li a {
  display: flex;
  align-items: center;
  padding: 8px 12px 8px 32px;
  color: var(--sidebar-muted);
  text-decoration: none;
  font-weight: 500;
  font-size: 13px;
  border-radius: 6px;
  margin-bottom: 2px;
  transition: all 0.2s ease-in-out;
}

.cat-sub-menu li a:hover {
  background-color: var(--sidebar-hover);
  color: var(--sidebar-text);
}

.sidebar-footer .sidebar-body-menu button {
  display: flex;
  align-items: center;
  padding: 11px 12px;
  color: var(--sidebar-text);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  border: none;
  background: transparent;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
  width: 100%;
  text-decoration: none;
  margin-bottom: 4px;
}

.sidebar-footer .sidebar-body-menu button:hover {
  background-color: var(--sidebar-hover);
}

.sidebar-footer .sidebar-body-menu button.text-danger {
  color: #dc3545;
}

.sidebar-category {
  padding: 16px 14px 8px;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-muted);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.sidebar-footer .sidebar-body-menu button.text-danger:hover {
  background-color: rgba(220, 53, 69, 0.1);
}
</style>
