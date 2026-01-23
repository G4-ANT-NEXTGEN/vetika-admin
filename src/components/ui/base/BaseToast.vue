<template>
  <div :class="['toast', `toast-${type}`]" role="alert">
    <div class="toast-header">
      <div class="d-flex align-items-center flex-grow-1">
        <i :class="['bi', toastIcon, 'me-2']"></i>
        <strong class="me-auto">{{ typeLabel }}</strong>
      </div>
      <button type="button" class="btn-close" @click="$emit('close')"></button>
    </div>
    <div class="toast-body">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value),
  },
})

defineEmits(['close'])

const typeLabel = computed(() => {
  const labels = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
  }
  return labels[props.type]
})

const toastIcon = computed(() => {
  const icons = {
    success: 'bi-check-circle-fill',
    error: 'bi-exclamation-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill',
  }
  return icons[props.type]
})
</script>

<style scoped>
.toast {
  min-width: 300px;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
  background-color: var(--color-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Success - Green theme */
.toast-success {
  background-color: rgba(25, 135, 84, 0.1);
  border: 1px solid rgba(25, 135, 84, 0.3);
  color: #198754;
}

.toast-success .toast-header {
  background-color: rgba(25, 135, 84, 0.15);
  border-bottom: 1px solid rgba(25, 135, 84, 0.3);
  color: #198754;
}

/* Error - Red theme */
.toast-error {
  background-color: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  color: #dc3545;
}

.toast-error .toast-header {
  background-color: rgba(220, 53, 69, 0.15);
  border-bottom: 1px solid rgba(220, 53, 69, 0.3);
  color: #dc3545;
}

/* Warning - Orange theme */
.toast-warning {
  background-color: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  color: #ffc107;
}

.toast-warning .toast-header {
  background-color: rgba(255, 193, 7, 0.15);
  border-bottom: 1px solid rgba(255, 193, 7, 0.3);
  color: #ffc107;
}

/* Info - Blue theme */
.toast-info {
  background-color: rgba(13, 110, 253, 0.1);
  border: 1px solid rgba(13, 110, 253, 0.3);
  color: #0d6efd;
}

.toast-info .toast-header {
  background-color: rgba(13, 110, 253, 0.15);
  border-bottom: 1px solid rgba(13, 110, 253, 0.3);
  color: #0d6efd;
}

.toast-header {
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px 8px 0 0;
}

.toast-body {
  padding: 0.75rem;
}

.btn-close {
  align-self: flex-start;
}

/* Dark mode adjustments - Brighter colors for better visibility */
[data-theme='dark'] .toast-success {
  background-color: rgba(25, 135, 84, 0.15);
  border-color: rgba(25, 135, 84, 0.4);
  color: #4ade80;
}

[data-theme='dark'] .toast-success .toast-header {
  background-color: rgba(25, 135, 84, 0.2);
  color: #4ade80;
}

[data-theme='dark'] .toast-error {
  background-color: rgba(220, 53, 69, 0.15);
  border-color: rgba(220, 53, 69, 0.4);
  color: #f87171;
}

[data-theme='dark'] .toast-error .toast-header {
  background-color: rgba(220, 53, 69, 0.2);
  color: #f87171;
}

[data-theme='dark'] .toast-warning {
  background-color: rgba(255, 193, 7, 0.15);
  border-color: rgba(255, 193, 7, 0.4);
  color: #fbbf24;
}

[data-theme='dark'] .toast-warning .toast-header {
  background-color: rgba(255, 193, 7, 0.2);
  color: #fbbf24;
}

[data-theme='dark'] .toast-info {
  background-color: rgba(13, 110, 253, 0.15);
  border-color: rgba(13, 110, 253, 0.4);
  color: #60a5fa;
}

[data-theme='dark'] .toast-info .toast-header {
  background-color: rgba(13, 110, 253, 0.2);
  color: #60a5fa;
}
</style>
