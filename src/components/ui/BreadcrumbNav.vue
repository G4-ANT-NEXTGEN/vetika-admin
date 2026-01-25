<template>
  <nav class="breadcrumb-nav">
    <ol class="breadcrumb">
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
        class="breadcrumb-item"
        :class="{ active: index === breadcrumbs.length - 1 }"
      >
        <router-link v-if="crumb.path && index < breadcrumbs.length - 1" :to="crumb.path" class="breadcrumb-link">
          <i v-if="crumb.icon" :class="['bi', `bi-${crumb.icon}`, 'me-1']"></i>
          {{ crumb.label }}
        </router-link>
        <span v-else class="breadcrumb-text">
          <i v-if="crumb.icon" :class="['bi', `bi-${crumb.icon}`, 'me-1']"></i>
          {{ crumb.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps({
  breadcrumbs: {
    type: Array,
    required: true,
    validator: (value) => value.every(crumb => typeof crumb.label === 'string')
  }
})
</script>

<style scoped>
.breadcrumb-nav {
  padding: 0.75rem 0;
  margin: 0;
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 0;
  list-style: none;
  gap: 0.5rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.breadcrumb-item:not(:last-child)::after {
  content: '/';
  display: inline-flex;
  align-items: center;
  margin-left: 0.5rem;
  color: var(--color-muted);
}

.breadcrumb-link {
  color: #6c757d;
  text-decoration: none;
  transition: color 0.15s ease-in-out;
  display: inline-flex;
  align-items: center;
}

.breadcrumb-link:hover {
  color: var(--color-text);
}

.breadcrumb-text {
  color: var(--color-text);
  display: inline-flex;
  align-items: center;
  font-weight: 500;
}

.breadcrumb-item.active {
  color: var(--color-text);
}

@media (max-width: 576px) {
  .breadcrumb {
    gap: 0.25rem;
  }

  .breadcrumb-item:not(:last-child)::after {
    margin-left: 0.25rem;
  }

  .breadcrumb-link,
  .breadcrumb-text {
    font-size: 0.85rem;
  }
}
</style>
