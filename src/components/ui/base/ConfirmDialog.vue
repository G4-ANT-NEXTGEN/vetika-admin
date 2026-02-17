<template>
  <teleport to="body">
    <div v-if="isVisible" class="confirm-overlay" @click.self="handleCancel">
      <div class="confirm-dialog">
        <div class="confirm-header">
          <div :class="['confirm-icon-wrapper', type]">
            <i :class="['bi', dialogIcon, 'confirm-icon']"></i>
          </div>
        </div>

        <div class="confirm-body">
          <h5 class="confirm-title">{{ title }}</h5>
          <p class="confirm-message">{{ message }}</p>

          <div v-if="$slots.default" class="confirm-content">
            <slot />
          </div>
        </div>

        <div class="confirm-footer">
          <button type="button" class="btn btn-outline-secondary" @click="handleCancel">
            <i class="bi bi-x-lg" aria-hidden="true"></i>
            {{ cancelText }}
          </button>
          <button type="button" :class="['btn', buttonClass]" :disabled="isLoading" @click="handleConfirm">
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else :class="['bi', confirmIcon]" aria-hidden="true"></i>
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useConfirm } from '@/composables/useConfirm'

const { confirmState, confirm, cancel } = useConfirm()

const isLoading = ref(false)

const isVisible = computed(() => confirmState.isVisible)
const title = computed(() => confirmState.title)
const message = computed(() => confirmState.message)
const confirmText = computed(() => confirmState.confirmText)
const cancelText = computed(() => confirmState.cancelText)
const type = computed(() => confirmState.type)

const dialogIcon = computed(() => {
  const icons = {
    warning: 'bi-exclamation-triangle-fill',
    danger: 'bi-exclamation-circle-fill',
    info: 'bi-info-circle-fill',
  }
  return icons[type.value] || icons.warning
})

const confirmIcon = computed(() => {
  const icons = {
    warning: 'bi-exclamation-triangle',
    danger: 'bi-box-arrow-right',
    info: 'bi-check-circle',
  }
  return icons[type.value] || icons.warning
})

const buttonClass = computed(() => {
  const classes = {
    warning: 'btn-warning',
    danger: 'btn-danger',
    info: 'btn-info',
  }
  return classes[type.value] || classes.warning
})

const handleConfirm = async () => {
  isLoading.value = true
  try {
    await confirm()
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  cancel()
}
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.7));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  animation: fadeIn 0.2s ease-out;
  backdrop-filter: blur(6px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.confirm-dialog {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent), var(--color-secondary);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  max-width: 520px;
  width: 90%;
  padding: 0;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
  position: relative;
}

.confirm-dialog::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary), rgba(59, 130, 246, 0.15));
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.confirm-header {
  padding: 1.25rem 1.5rem 0.5rem;
  text-align: left;
  background: transparent;
}

.confirm-icon-wrapper {
  display: inline-flex;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  border: 1px solid var(--color-border);
  background: rgba(59, 130, 246, 0.35);
  color: #fff;
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.confirm-icon,
.confirm-footer i {
  font-family: "bootstrap-icons";
  font-style: normal;
  line-height: 1;
  display: inline-block;
}

.confirm-icon {
  font-size: 22px;
  color: inherit;
}

.confirm-footer i {
  font-size: 14px;
}

.confirm-icon-wrapper.danger {
  background: rgba(239, 68, 68, 0.35);
  color: #fff;
  border-color: rgba(239, 68, 68, 0.6);
}

.confirm-icon-wrapper.warning {
  background: rgba(234, 179, 8, 0.4);
  color: #fff;
  border-color: rgba(234, 179, 8, 0.6);
}

.confirm-icon-wrapper.info {
  background: rgba(59, 130, 246, 0.35);
  color: #fff;
  border-color: rgba(59, 130, 246, 0.6);
}

.confirm-body {
  padding: 0.75rem 1.5rem 1.5rem;
  text-align: left;
}

.confirm-title {
  margin: 0 0 0.5rem;
  font-weight: 700;
  color: var(--color-text);
  font-size: 1.35rem;
}

.confirm-message {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.95rem;
  line-height: 1.55;
}

.confirm-content {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.confirm-footer {
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid var(--color-border);
}

.confirm-footer :deep(.btn) {
  min-width: 120px;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.confirm-footer :deep(.btn-outline-secondary) {
  background: transparent;
  border-color: var(--color-border);
  color: var(--color-text);
}

.confirm-footer :deep(.btn-outline-secondary:hover) {
  background: var(--color-hover);
}

.btn-danger {
  background-color: var(--color-danger);
  border-color: var(--color-danger);
  color: #fff;
}

.btn-info {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.btn-warning {
  background-color: #eab308;
  border-color: #eab308;
  color: #fff;
}

.confirm-footer .btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .confirm-dialog {
    width: 95%;
  }

  .confirm-header {
    padding: 1.5rem 1rem 0.75rem;
  }

  .confirm-body {
    padding: 1rem;
  }

  .confirm-footer {
    padding: 1rem 1rem 1.25rem;
    flex-direction: column;
  }

  .confirm-footer .btn {
    width: 100%;
  }
}
</style>
