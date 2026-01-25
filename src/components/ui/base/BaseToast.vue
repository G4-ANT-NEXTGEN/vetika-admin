<template>
  <div :class="['custom-toast', `toast-${type}`]" role="alert">
    <div class="toast-header">
      <div class="header-left">
        <div class="icon-box">
          <i :class="['bi', toastIcon]"></i>
        </div>
        <span class="type-title">{{ typeLabel }}</span>
      </div>
      <button type="button" class="btn-close-custom" @click="$emit('close')" aria-label="Close">
        <i class="bi bi-x"></i>
      </button>
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
    error: 'Failed',
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
.custom-toast {
  min-width: 320px;
  max-width: 420px;
  background-color: #1e1e1e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}

.toast-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
}

.type-title {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.toast-body {
  padding: 16px;
  color: #e0e0e0;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
}

.btn-close-custom {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.btn-close-custom:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* Type Specific Themes */

/* Success */
.toast-success .toast-header {
  background-color: rgba(34, 197, 94, 0.15);
}
.toast-success .type-title,
.toast-success .icon-box {
  color: #4ade80;
}

/* Error */
.toast-error .toast-header {
  background-color: rgba(239, 68, 68, 0.15);
}
.toast-error .type-title,
.toast-error .icon-box {
  color: #f87171;
}

/* Warning */
.toast-warning .toast-header {
  background-color: rgba(234, 179, 8, 0.15);
}
.toast-warning .type-title,
.toast-warning .icon-box {
  color: #facc15;
}

/* Info */
.toast-info .toast-header {
  background-color: rgba(59, 130, 246, 0.15);
}
.toast-info .type-title,
.toast-info .icon-box {
  color: #60a5fa;
}

/* Bottom Glow Effect */
.custom-toast::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  opacity: 0.6;
}

.toast-success::after { background: #22c55e; }
.toast-error::after { background: #ef4444; }
.toast-warning::after { background: #eab308; }
.toast-info::after { background: #3b82f6; }
</style>
