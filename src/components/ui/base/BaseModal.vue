<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="show" class="modal-overlay" @click.self="close">
        <div class="modal-container" :class="[size, variant]" @click.stop>
          <!-- Topographic Header (Optional for Add/Update) -->
          <div v-if="hasPatternHeader" class="pattern-header">
            <button class="close-btn circle" @click="close">
              <i class="bi bi-x"></i>
            </button>
            <div class="header-text-group">
              <h2 class="modal-title">{{ title }}</h2>
              <p class="modal-subtitle">{{ subtitle }}</p>
            </div>
          </div>

          <!-- Standard Header (For Details/Delete) -->
          <div v-else class="standard-header">
            <div class="title-with-icon">
              <slot name="header-icon" />
              <div class="header-text-group">
                <h2 class="modal-title">{{ title }}</h2>
                <p class="modal-subtitle">{{ subtitle }}</p>
              </div>
            </div>
            <button class="close-btn" @click="close">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Content Body -->
          <div class="modal-body">
            <slot />
          </div>

          <!-- Actions Footer -->
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  subtitle: String,
  size: { type: String, default: 'md' }, // sm, md, lg
  variant: { type: String, default: 'standard' }, // standard, pattern
  hasPatternHeader: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])
const close = () => emit('close')
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

[data-theme="dark"] .modal-overlay {
  background: rgba(0, 0, 0, 0.7);
}

.modal-container {
  background: var(--nav-bg);
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  position: relative;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--color-border);
}

.modal-container.lg {
  max-width: 800px;
}

.modal-container.xl {
  max-width: 1100px;
}

.modal-container.sm {
  max-width: 400px;
}

/* Pattern Header (Topographic Look) */
.pattern-header {
  height: 180px;
  background-color: var(--nav-surface);
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("/images/modal_header_image/modal_image.jpg");
  background-size: cover;
  background-position: center;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
}

.close-btn.circle {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

/* Standard Header */
.standard-header {
  padding: 24px 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--color-border);
}

.title-with-icon {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.header-text-group {
  display: flex;
  flex-direction: column;
}

.modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
}

.pattern-header .modal-title {
  color: #ffffff;
}

.modal-subtitle {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: var(--color-muted);
}

.pattern-header .modal-subtitle {
  color: rgba(255, 255, 255, 0.8);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  padding: 4px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 1;
}

/* Body & Footer */
.modal-body {
  padding: 30px;
  overflow-y: auto;
}

.modal-footer {
  padding: 0 30px 30px 30px;
  display: flex;
  gap: 12px;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
