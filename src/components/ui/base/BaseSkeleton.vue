<template>
  <div
    class="base-skeleton"
    :class="[type, { 'animate-shimmer': animated }]"
    :style="skeletonStyle"
  ></div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'rect', // rect, circle, line
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '20px',
  },
  borderRadius: {
    type: String,
    default: '4px',
  },
  animated: {
    type: Boolean,
    default: true,
  },
})

const skeletonStyle = computed(() => ({
  width: props.width,
  height: props.height,
  borderRadius: props.type === 'circle' ? '50%' : props.borderRadius,
}))
</script>

<style scoped>
.base-skeleton {
  background: var(--color-text);
  opacity: 0.06;
  position: relative;
  overflow: hidden;
}

[data-theme='dark'] .base-skeleton {
  opacity: 0.12;
}

.animate-shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.08),
    transparent
  );
  animation: shimmer 1.8s infinite;
}

[data-theme='light'] .animate-shimmer::after {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 0, 0, 0.04),
    transparent
  );
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
