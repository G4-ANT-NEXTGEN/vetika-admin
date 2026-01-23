<template>
  <div :class="['loading-spinner', `spinner-${props.size}`, `spinner-${props.variant}`]">
    <div class="spinner-animation">
      <div class="spinner-dot"></div>
      <div class="spinner-dot"></div>
      <div class="spinner-dot"></div>
      <div class="spinner-dot"></div>
    </div>
    <p v-if="props.label" class="spinner-label">{{ props.label }}</p>
  </div>
</template>

<script setup>
  const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) =>
      ['primary', 'secondary', 'success', 'danger', 'warning', 'info'].includes(value),
  },
  label: {
    type: String,
    default: '',
  },
})

</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.spinner-animation {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner-dot {
  border-radius: 50%;
  animation: bounceDot 1.4s infinite ease-in-out both;
}

.spinner-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.spinner-dot:nth-child(2) {
  animation-delay: -0.16s;
}

.spinner-dot:nth-child(3) {
  animation-delay: 0s;
}

.spinner-dot:nth-child(4) {
  animation-delay: 0.16s;
}

@keyframes bounceDot {
  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Size variants */
.spinner-sm .spinner-dot {
  width: 6px;
  height: 6px;
}

.spinner-md .spinner-dot {
  width: 10px;
  height: 10px;
}

.spinner-lg .spinner-dot {
  width: 14px;
  height: 14px;
}

/* Color variants */
.spinner-primary .spinner-dot {
  background-color: #0d6efd;
}

.spinner-secondary .spinner-dot {
  background-color: #6c757d;
}

.spinner-success .spinner-dot {
  background-color: #198754;
}

.spinner-danger .spinner-dot {
  background-color: #dc3545;
}

.spinner-warning .spinner-dot {
  background-color: #ffc107;
}

.spinner-info .spinner-dot {
  background-color: #0dcaf0;
}

.spinner-label {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-muted);
  font-weight: 500;
}

/* Full page loading spinner */
.loading-spinner.fullpage {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-background);
  opacity: 0.95;
  z-index: 9999;
}

/* Overlay loading spinner */
.loading-spinner.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-background);
  opacity: 0.9;
  z-index: 1000;
}
</style>
