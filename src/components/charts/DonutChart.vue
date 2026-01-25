<template>
  <div class="donut-chart-container">
    <div class="donut-main">
      <div class="donut-wrapper">
        <svg viewBox="0 0 100 100" class="donut-svg">
          <circle
            v-for="(segment, index) in chartSegments"
            :key="index"
            class="donut-segment"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            :stroke="segment.color"
            stroke-width="12"
            :stroke-dasharray="segment.dashArray"
            :stroke-dashoffset="segment.dashOffset"
          />
          <text x="50" y="50" class="donut-center-text">
            <tspan x="50" dy="-2" class="total-count">{{ total }}</tspan>
            <tspan x="50" dy="15" class="total-label">Items</tspan>
          </text>
        </svg>
      </div>

      <div class="legend">
        <div v-for="item in data" :key="item.label" class="legend-item">
          <div class="dot" :style="{ backgroundColor: item.color }"></div>
          <span class="label">{{ item.label }}</span>
          <span class="value">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
    // expected: [{ label: 'Skills', value: 10, color: '#...' }]
  }
})

const total = computed(() => {
  return props.data.reduce((acc, curr) => acc + curr.value, 0)
})

const chartSegments = computed(() => {
  let cumulativeValue = 0
  const totalVal = total.value || 1

  return props.data.map(item => {
    const percentage = (item.value / totalVal) * 100
    const dashArray = `${percentage} ${100 - percentage}`
    const dashOffset = 100 - cumulativeValue + 25 // Start from top
    cumulativeValue += percentage

    return {
      ...item,
      dashArray,
      dashOffset
    }
  })
})
</script>

<style scoped>
.donut-chart-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.donut-main {
  display: flex;
  align-items: center;
  gap: 40px;
}

.donut-wrapper {
  width: 180px;
  height: 180px;
  position: relative;
  flex-shrink: 0;
}

.donut-svg {
  transform: rotate(-90deg);
}

.donut-segment {
  transition: stroke-dashoffset 0.8s ease-in-out;
}

.donut-center-text {
  text-anchor: middle;
  fill: var(--color-text);
}

.total-count {
  font-size: 16px;
  font-weight: 800;
}

.total-label {
  font-size: 8px;
  font-weight: 500;
  fill: var(--color-muted);
}

.legend {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.label {
  color: var(--color-muted);
  flex-grow: 1;
  font-weight: 500;
}

.value {
  font-weight: 700;
  color: var(--color-text);
}
</style>
