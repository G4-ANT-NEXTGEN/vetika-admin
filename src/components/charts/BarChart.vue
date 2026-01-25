<template>
  <BaseCard class="bar-chart-card">
    <template #header>
      <div class="chart-header">
        <div class="section-title">
          <i :class="['bi', icon]" aria-hidden="true"></i>
          <span>{{ title }}</span>
        </div>
        <span v-if="subtitle" class="muted">{{ subtitle }}</span>
      </div>
    </template>

    <div v-if="isLoading" class="chart-loading skeleton-chart">
      <div v-for="i in 5" :key="i" class="skeleton-bar-wrapper">
        <BaseSkeleton type="rect" :height="Math.random() * 60 + 40 + '%'" width="100%" borderRadius="6px 6px 0 0" />
      </div>
    </div>

    <div v-else-if="!data || data.length === 0" class="chart-empty">
      <p>No data available</p>
    </div>

    <div v-else class="chart-container">
      <div class="chart-inner">
        <!-- Y-Axis Labels -->
        <div class="y-axis">
          <div v-for="step in gridSteps" :key="step" class="y-label">
            {{ step }}
          </div>
        </div>

        <!-- Chart Plot Area -->
        <div class="chart-plot">
          <!-- Horizontal Grid Lines -->
          <div class="grid-lines">
            <div v-for="step in gridSteps" :key="'grid-' + step" class="grid-line"></div>
          </div>

          <!-- Bars Area -->
          <div class="bars-container">
            <div v-for="bar in data" :key="bar.label" class="bar-item">
              <div class="bar-fill-wrapper">
                <div class="bar-fill" :style="{ height: getBarHeight(bar.height) + '%' }">
                  <span class="bar-value-tooltip">{{ bar.height }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- X-Axis Labels -->
          <div class="x-axis-labels">
            <div v-for="bar in data" :key="'label-' + bar.label" class="x-label-item">
              {{ bar.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '@/components/ui/base/BaseCard.vue'
import BaseSkeleton from '@/components/ui/base/BaseSkeleton.vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'bi-graph-up',
  },
  data: {
    type: Array,
    required: true,
    validator: (arr) => arr.every((item) => item.label && typeof item.height === 'number'),
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const maxVal = computed(() => {
  const values = props.data.map(item => item.height)
  const max = Math.max(...values, 10)
  return Math.ceil(max / 10) * 10
})

const gridSteps = computed(() => {
  const max = maxVal.value
  const steps = []
  for (let i = 4; i >= 0; i--) {
    steps.push(Math.round((max / 4) * i))
  }
  return steps
})

const getBarHeight = (height) => {
  return (height / maxVal.value) * 100
}
</script>

<style scoped>
.bar-chart-card {
  min-height: 380px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
}

.muted {
  color: var(--color-muted);
  font-size: 14px;
}

.chart-container {
  flex-grow: 1;
  padding: 10px 0;
}

.chart-inner {
  display: flex;
  gap: 16px;
  height: 280px;
}


.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 0 32px 0;
  color: var(--color-muted);
  font-size: 12px;
  text-align: right;
  width: 40px;
}


.chart-plot {
  flex-grow: 1;
  position: relative;
  display: flex;
  flex-direction: column;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

.grid-line {
  border-top: 1px dashed rgba(255, 255, 255, 0.05);
  width: 100%;
}

.grid-line:last-child {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}


.bars-container {
  flex-grow: 1;
  margin-bottom: 32px;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  padding: 0 10px;
  z-index: 2;
  position: relative;
}

.bar-item {
  flex: 1;
  max-width: 70px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.bar-fill-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.bar-fill {
  width: 100%;
  background: #3a3a3a;
  border-radius: 6px 6px 0 0;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  display: flex;
  justify-content: center;
}


.bar-item:nth-child(1) .bar-fill { background: #2a2a2a; }
.bar-item:nth-child(2) .bar-fill { background: #4a4a4a; }
.bar-item:nth-child(3) .bar-fill { background: #333333; }
.bar-item:nth-child(4) .bar-fill { background: #5a5a5a; }
.bar-item:nth-child(5) .bar-fill { background: #3d3d3d; }

.bar-fill:hover {
  background: #6a6a6a !important;
  filter: brightness(1.2);
}


.bar-value-tooltip {
  position: absolute;
  top: -24px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  opacity: 0;
  transition: all 0.2s ease;
  background: rgba(0,0,0,0.8);
  padding: 2px 6px;
  border-radius: 4px;
}

.bar-fill:hover .bar-value-tooltip {
  opacity: 1;
  transform: translateY(-4px);
}


.x-axis-labels {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 32px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 10px;
}

.x-label-item {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: var(--color-muted);
  font-weight: 500;
}

.chart-loading,
.chart-empty {
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
}

.skeleton-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 16px;
  padding: 0 10px 32px 56px; /* Match chart layout */
}

.skeleton-bar-wrapper {
  flex: 1;
  max-width: 70px;
  height: 100%;
  display: flex;
  align-items: flex-end;
}
</style>
