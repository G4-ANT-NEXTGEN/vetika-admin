<template>
  <div class="base-card">
    <slot />
  </div>
</template>

<style scoped>
.base-card {
  background-color: var(--color-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 1rem;
  border-radius: 8px;
}
</style>
