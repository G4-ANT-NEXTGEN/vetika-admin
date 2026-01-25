<template>
  <div class="trend-chart">
    <svg viewBox="0 0 400 150" class="trend-svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--color-text)" stop-opacity="0.2" />
          <stop offset="100%" stop-color="var(--color-text)" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- Area Fill -->
      <path :d="areaPath" fill="url(#areaGradient)" class="area-path" />

      <!-- Line Path -->
      <path :d="linePath" fill="transparent" stroke="var(--color-text)" stroke-width="2" class="line-path" />

      <!-- Data Points -->
      <circle
        v-for="(point, index) in points"
        :key="index"
        :cx="point.x"
        :cy="point.y"
        r="4"
        fill="var(--nav-bg)"
        stroke="var(--color-text)"
        stroke-width="1.5"
        class="data-point"
      />
    </svg>

    <div class="x-axis">
      <span v-for="label in labels" :key="label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
    // expected: [12, 19, 15, 25, 22, 30]
  },
  labels: {
    type: Array,
    default: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  }
})

const points = computed(() => {
  const max = Math.max(...props.data, 1)
  const width = 400
  const height = 150
  const padding = 20

  return props.data.map((val, i) => ({
    x: (i / (props.data.length - 1)) * (width - (padding * 2)) + padding,
    y: height - (val / max) * (height - (padding * 2)) - padding
  }))
})

const linePath = computed(() => {
  if (points.value.length < 2) return ''
  return `M ${points.value.map(p => `${p.x},${p.y}`).join(' L ')}`
})

const areaPath = computed(() => {
  if (points.value.length < 2) return ''
  const first = points.value[0]
  const last = points.value[points.value.length - 1]
  const height = 150

  return `${linePath.value} L ${last.x},${height} L ${first.x},${height} Z`
})
</script>

<style scoped>
.trend-chart {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trend-svg {
  width: 100%;
  height: 160px;
  overflow: visible;
}

.line-path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 2s ease forwards;
}

.area-path {
  opacity: 0;
  animation: fadeIn 1s ease 1s forwards;
}

.data-point {
  animation: popIn 0.5s ease backwards;
}

.x-axis {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  color: var(--color-muted);
  font-size: 11px;
  font-weight: 500;
}

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}

@keyframes fadeIn {
  to { opacity: 1; }
}

@keyframes popIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
