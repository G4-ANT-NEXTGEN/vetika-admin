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
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import BaseCard from '@/components/ui/base/BaseCard.vue'
import BaseSkeleton from '@/components/ui/base/BaseSkeleton.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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

const chartData = computed(() => ({
  labels: props.data.map(item => item.label),
  datasets: [
    {
      label: props.title,
      data: props.data.map(item => item.height),
      backgroundColor: [
        'rgba(59, 130, 246, 0.85)',
        'rgba(16, 185, 129, 0.85)',
        'rgba(245, 158, 11, 0.85)',
        'rgba(99, 102, 241, 0.85)',
        'rgba(236, 72, 153, 0.85)',
        'rgba(34, 197, 94, 0.85)',
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(99, 102, 241, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(34, 197, 94, 1)',
      ],
      borderWidth: 1,
      borderRadius: 6,
      hoverBackgroundColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(99, 102, 241, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(34, 197, 94, 1)',
      ],
      barThickness: 28,
      maxBarThickness: 36,
      categoryPercentage: 0.8,
      barPercentage: 0.9,
    }
  ]
}))

const chartOptions = computed(() => {
  const isDark = themeStore.isDarkMode
  const textColor = isDark ? 'rgba(248, 248, 252, 0.8)' : 'rgba(3, 3, 7, 0.6)'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
        titleColor: isDark ? '#f8f8fc' : '#030307',
        bodyColor: isDark ? '#f8f8fc' : '#030307',
        padding: 12,
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return context.parsed.y.toString()
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: textColor,
          font: {
            size: 12,
            weight: 500
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
          drawBorder: false
        },
        ticks: {
          color: textColor,
          font: {
            size: 11
          },
          callback: function (value) {
            return Number.isInteger(value) ? value : ''
          }
        }
      }
    },
    animation: {
      duration: 800,
      easing: 'easeInOutQuart'
    }
  }
})
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
  height: 280px;
  position: relative;
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
  padding: 0 10px 32px 10px;
}

.skeleton-bar-wrapper {
  flex: 1;
  max-width: 70px;
  height: 100%;
  display: flex;
  align-items: flex-end;
}
</style>
