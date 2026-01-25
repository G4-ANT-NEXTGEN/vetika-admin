<template>
  <BaseCard class="progress-chart-card">
    <template #header>
      <div class="chart-header">
        <div class="section-title">
          <i :class="['bi', icon]" aria-hidden="true"></i>
          <span>{{ title }}</span>
        </div>
      </div>
    </template>

    <div v-if="isLoading" class="chart-loading skeleton-progress-list">
      <div v-for="i in 4" :key="i" class="skeleton-progress-row">
        <div class="skeleton-progress-top">
          <BaseSkeleton width="40%" height="14px" />
          <BaseSkeleton width="15%" height="14px" />
        </div>
        <BaseSkeleton width="100%" height="8px" borderRadius="999px" />
      </div>
    </div>

    <div v-else-if="!data || data.length === 0" class="chart-empty">
      <p>No data available</p>
    </div>

    <div v-else class="progress-container">
      <div class="progress-list">
        <div v-for="item in data" :key="item.label" class="progress-row">
          <div class="progress-top">
            <span>{{ item.label }}</span>
            <span class="muted">{{ item.value }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: item.value + '%' }"></div>
          </div>
        </div>
      </div>

      <div v-if="summary" class="summary-row">
        <div v-for="(value, key) in summary" :key="key" class="summary-card">
          <span class="summary-value">{{ value }}</span>
          <span class="summary-label">{{ formatLabel(key) }}</span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/ui/base/BaseCard.vue'
import BaseSkeleton from '@/components/ui/base/BaseSkeleton.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'bi-speedometer2',
  },
  data: {
    type: Array,
    required: true,
    validator: (arr) =>
      arr.every((item) => item.label && typeof item.value === 'number'),
  },
  summary: {
    type: Object,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const formatLabel = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}
</script>

<style scoped>
.progress-chart-card {
  min-height: 260px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--color-text);
}

.muted {
  color: var(--color-muted);
  font-size: 12px;
}

.chart-loading,
.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  color: var(--color-muted);
}

.skeleton-progress-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 10px 0;
}

.skeleton-progress-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-progress-top {
  display: flex;
  justify-content: space-between;
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.progress-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-top {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--color-text);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--color-border);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-text);
  border-radius: 999px;
  opacity: 0.9;
  transition: width 0.4s ease;
}

.summary-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.summary-card {
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  display: grid;
  gap: 4px;
  background: var(--nav-bg);
}

.summary-value {
  font-weight: 700;
  color: var(--color-text);
}

.summary-label {
  color: var(--color-muted);
  font-size: 12px;
}
</style>
