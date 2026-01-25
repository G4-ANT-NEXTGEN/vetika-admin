<template>
  <div class="analytics-page">
    <header class="page-header custom-header">
      <div class="header-content">
        <div class="eyebrow-wrapper">
          <div class="icon-circle small">
            <i class="bi bi-graph-up-arrow"></i>
          </div>
          <p class="eyebrow">Advanced Insights</p>
        </div>
        <h1 class="header-title">Data Analytics</h1>
        <p class="subtext">A deeper look into your platform's performance and trends</p>

        <div class="header-actions">
          <RouterLink to="/" class="btn back">
            <i class="bi bi-arrow-left"></i>
            Back to Dashboard
          </RouterLink>
          <button class="btn export" @click="exportHighRes">
            <i class="bi bi-download"></i>
            Export PDF Report
          </button>
        </div>
      </div>
    </header>

    <div class="analytics-grid">
      <div class="main-charts">
        <!-- Content Distribution -->
        <BaseCard class="analytics-card">
          <DonutChart :data="distributionData" :is-loading="dashboardStore.isLoading" />
        </BaseCard>

        <!-- Growth Trends -->
        <BaseCard class="analytics-card">
          <TrendChart
            :data="growthData"
            :labels="['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']"
          />
        </BaseCard>
      </div>

      <!-- Distribution Metrics -->
      <div class="side-metrics">
        <BaseCard class="analytics-card health-card">
          <div class="health-metrics">
            <div class="health-item">
              <span class="label">Sync Speed</span>
              <strong class="value">{{ syncSpeed }}ms</strong>
            </div>
            <div class="health-item">
              <span class="label">Total Items</span>
              <strong class="value">{{ dashboardStore.summaryData.totalRecords }}</strong>
            </div>
          </div>
        </BaseCard>

        <!-- Resource Allocation -->
        <BaseCard class="analytics-card allocation-card">
          <div class="mini-bar-chart">
            <div v-for="item in distributionData" :key="item.label" class="mini-bar-row">
              <div class="mini-bar-info">
                <span>{{ item.label }}</span>
                <span>{{ Math.round((item.value / totalCount) * 100) }}%</span>
              </div>
              <div class="mini-progress">
                <div class="mini-fill" :style="{ width: (item.value / totalCount) * 100 + '%', backgroundColor: item.color }"></div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Bottom Section: Logs & Categories -->
    <div class="analytics-footer-grid">
      <BaseCard class="analytics-card active-categories">
        <template #header>
          <div class="section-title">
            <i class="bi bi-folder2-open"></i>
            <span>Active Categories</span>
          </div>
        </template>
        <div class="category-list-mini">
          <div v-for="cat in dashboardStore.categories.slice(0, 5)" :key="cat.id" class="category-pill-item">
            <span class="dot-sm"></span>
            <span class="name">{{ cat.name }}</span>
          </div>
          <div v-if="!dashboardStore.categories.length" class="empty-state">No categories defined</div>
        </div>
      </BaseCard>

      <BaseCard class="analytics-card audit-log">
        <template #header>
          <div class="section-title">
            <i class="bi bi-journal-text"></i>
            <span>System Audit Log</span>
          </div>
        </template>
        <div class="audit-table-wrapper">
          <table class="audit-table">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Status</th>
                <th>Integrity</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in recentLogs" :key="log.name">
                <td>
                  <div class="resource-cell">
                    <span class="name">{{ log.name }}</span>
                    <span class="type">{{ log.type }}</span>
                  </div>
                </td>
                <td><span class="badge-status">Active</span></td>
                <td>
                  <div class="integrity-score">
                    <div class="score-bar" :style="{ width: log.score + '%' }"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import BaseCard from '@/components/ui/base/BaseCard.vue'
import DonutChart from '@/components/charts/DonutChart.vue'
import TrendChart from '@/components/charts/TrendChart.vue'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()
const syncSpeed = ref(149)

onMounted(() => {
  if (!dashboardStore.skills.length) {
    dashboardStore.fetchDashboardData()
  }
})

const distributionData = computed(() => [
  { label: 'Skills', value: dashboardStore.skills.length || 3, color: '#333' },
  { label: 'Schools', value: dashboardStore.schools.length || 5, color: '#666' },
  { label: 'Subjects', value: dashboardStore.subjects.length || 3, color: '#999' },
  { label: 'Degrees', value: dashboardStore.degrees.length || 3, color: '#ccc' },
])

const recentLogs = computed(() => {
  const items = [
    ...dashboardStore.skills.slice(0, 2).map(s => ({ name: s.name, type: 'Skill', score: 95 })),
    ...dashboardStore.schools.slice(0, 2).map(s => ({ name: s.name, type: 'School', score: 100 })),
    ...dashboardStore.subjects.slice(0, 1).map(s => ({ name: s.name, type: 'Subject', score: 88 })),
  ];
  return items.length ? items : [
    { name: 'System Core', type: 'Database', score: 100 },
    { name: 'API Gateway', type: 'Network', score: 99 }
  ];
})

const growthData = computed(() => {
  const base = totalCount.value || 14
  return [
    Math.round(base * 0.4),
    Math.round(base * 0.55),
    Math.round(base * 0.7),
    Math.round(base * 0.8),
    Math.round(base * 0.9),
    base
  ]
})

const totalCount = computed(() => {
  return distributionData.value.reduce((acc, curr) => acc + curr.value, 0) || 14
})

const exportHighRes = () => {
  window.print()
}
</script>

<style scoped>
/* Print Styles for high-quality PDF export */
@media print {
  .header-actions, .btn, .eyebrow-wrapper, .subtext {
    display: none !important;
  }

  .analytics-page {
    padding: 0 !important;
    gap: 15px !important;
  }

  .custom-header {
    border: none !important;
    padding: 20px 0 !important;
    background: transparent !important;
  }

  .header-title {
    font-size: 24px !important;
    color: #000 !important;
  }

  .analytics-grid, .analytics-footer-grid {
    display: block !important;
    width: 100% !important;
  }

  .analytics-card {
    margin-bottom: 20px !important;
    break-inside: avoid;
    border: 1px solid #eee !important;
    box-shadow: none !important;
  }

  /* Make sure background colors and shadows are printed if possible */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}

.analytics-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.custom-header {
  background-color: var(--nav-bg);
  border-radius: 12px;
  padding: 32px !important;
  border: 1px solid var(--color-border);
  display: flex !important;
  flex-direction: column;
  gap: 8px;
}

.eyebrow-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-circle.small {
  width: 24px;
  height: 24px;
  background: var(--nav-surface);
  border-radius: 6px;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--color-text);
}

.eyebrow {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-muted);
}

.header-title {
  margin: 4px 0;
  font-size: 26px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.subtext {
  margin: 0 0 20px 0;
  color: var(--color-muted);
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.btn.back {
  background: var(--nav-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn.back:hover {
  background: var(--color-hover);
}

.btn.export {
  background: #000;
  color: #fff;
  border: 1px solid #000;
}

[data-theme='dark'] .btn.export {
  background: #fff;
  color: #000;
  border: 1px solid #fff;
}

.analytics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.analytics-footer-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

.category-list-mini {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-pill-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: var(--nav-surface);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.dot-sm {
  width: 6px;
  height: 6px;
  background: var(--color-text);
  border-radius: 50%;
  opacity: 0.3;
}

.category-pill-item .name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.audit-table-wrapper {
  overflow-x: auto;
}

.audit-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.audit-table th {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-muted);
  text-transform: uppercase;
  padding: 0 0 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.audit-table td {
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
}

.audit-table tr:last-child td {
  border-bottom: none;
}

.resource-cell {
  display: flex;
  flex-direction: column;
}

.resource-cell .name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.resource-cell .type {
  font-size: 11px;
  color: var(--color-muted);
}

.badge-status {
  font-size: 11px;
  font-weight: 700;
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
}

.integrity-score {
  width: 80px;
  height: 4px;
  background: var(--nav-surface);
  border-radius: 99px;
  overflow: hidden;
}

.score-bar {
  height: 100%;
  background: var(--color-text);
  opacity: 0.4;
}

.main-charts, .side-metrics {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.health-metrics {
  display: flex;
  flex-direction: column;
}

.health-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
}

.health-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.health-item:first-child {
  padding-top: 0;
}

.health-item .label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
}

.health-item .value {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text);
}

.mini-bar-chart {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mini-bar-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mini-bar-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-muted);
}

.mini-progress {
  height: 6px;
  background: var(--color-border);
  border-radius: 99px;
  overflow: hidden;
}

.mini-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.8s ease;
  opacity: 0.8;
}

@media (max-width: 1024px) {
  .analytics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
