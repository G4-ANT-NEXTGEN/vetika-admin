<template>
  <div class="dashboard">
    <header class="page-header custom-header">
      <div class="header-content">
        <div class="eyebrow-wrapper">
          <div class="icon-circle">
            <i class="bi bi-lightning-charge-fill"></i>
          </div>
          <p class="eyebrow">Welcome back!</p>
        </div>
        <h1 class="header-title">Dashboard Overview</h1>
        <p class="subtext">Here's what's happening with your platform today</p>

        <div class="header-actions">
          <RouterLink to="/analytics" class="btn accent">
            <i class="bi bi-grid-3x3-gap"></i>
            View Analytics
          </RouterLink>
          <button class="btn outline" @click="generateReport">
            Generate Report
          </button>
        </div>
      </div>
    </header>

    <section class="cards-grid">
      <StatCard v-for="card in dashboardStore.statCardsData" :key="card.label" :label="card.label" :value="card.value"
        :change="card.change" :icon="card.icon" :icon-color="card.iconBg" :is-loading="dashboardStore.isLoading" />
    </section>

    <section class="quick-actions card">
      <div class="section-head">
        <div class="section-title">
          <i class="bi bi-lightning-charge-fill" aria-hidden="true"></i>
          <span>Quick Actions</span>
        </div>
      </div>
      <div class="actions-grid">
        <QuickActionCard v-for="action in dashboardStore.quickActionsData" :key="action.label" :label="action.label"
          :sub="action.sub" :icon="action.icon" @click="() => handleQuickAction(action.label)" />
      </div>
    </section>

    <section class="charts">
      <BarChart title="Category Distribution" subtitle="Total Items by category" icon="bi-graph-up"
        :data="dashboardStore.barChartData" :is-loading="dashboardStore.isLoading" />

      <ProgressBarChart title="Progress Overview" icon="bi-speedometer2" :data="dashboardStore.progressData"
        :summary="dashboardStore.summaryData" :is-loading="dashboardStore.isLoading" />
    </section>

    <section class="card recent-activity">
      <div class="section-head">
        <div class="section-title">
          <i class="bi bi-clock-history" aria-hidden="true"></i>
          <span>Recent Activity</span>
        </div>
        <RouterLink to="/activities" class="muted link">View All</RouterLink>
      </div>
      <ul v-if="activityStore.isLoading" class="activity-list">
        <li v-for="i in 5" :key="i" class="skeleton-activity-item">
          <BaseSkeleton width="40px" height="40px" borderRadius="10px" />
          <div class="skeleton-content">
            <BaseSkeleton width="150px" height="18px" />
            <BaseSkeleton width="220px" height="14px" />
          </div>
        </li>
      </ul>
      <ul v-else class="activity-list">
        <ActivityItem v-for="item in activityStore.activities" :key="item.id || item.title" :type="item.type" :title="item.title"
          :meta="item.meta" :time="item.time" :badge-color="item.badgeColor" />
      </ul>
    </section>
  </div>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import StatCard from '@/components/ui/StatCard.vue'
import QuickActionCard from '@/components/ui/QuickActionCard.vue'
import ActivityItem from '@/components/ui/ActivityItem.vue'
import BarChart from '@/components/charts/BarChart.vue'
import ProgressBarChart from '@/components/charts/ProgressBarChart.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useActivityStore } from '@/stores/activities'
import BaseSkeleton from '@/components/ui/base/BaseSkeleton.vue'

const dashboardStore = useDashboardStore()
const activityStore = useActivityStore()
const router = useRouter()

onMounted(() => {
  dashboardStore.fetchDashboardData()
  activityStore.fetchActivities()
})

const generateReport = () => {
  const data = dashboardStore.statCardsData.map(card => ({
    Category: card.label,
    Value: card.value,
    Change: `${card.change}%`
  }))

  const csvContent = "data:text/csv;charset=utf-8,"
    + "Category,Value,Change\n"
    + data.map(row => `${row.Category},${row.Value},${row.Change}`).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `dashboard_report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


const handleQuickAction = (label) => {
  const routes = {
    'Add Skill': '/skill',
    'Add School': '/school',
    'Add Degree': '/degree',
    'Add Subject': '/subject',
    'Add Category': '/category'
  }

  const path = routes[label]
  if (path) {
    router.push({ path, query: { action: 'create' } })
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.custom-header {
  position: relative;
  overflow: hidden;
  background-color: var(--nav-bg); /* Use theme background */
  background-image:
    linear-gradient(var(--color-text) 0.05px, transparent 0.05px),
    linear-gradient(90deg, var(--color-text) 0.05px, transparent 0.05px);
  background-size: 30px 30px;
  border-radius: 16px;
  padding: 40px !important;
  border: 1px solid var(--color-border);
  display: block !important;
}

[data-theme='light'] .custom-header {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
}

[data-theme='dark'] .custom-header {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
}

.eyebrow-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.icon-circle {
  width: 28px;
  height: 28px;
  background: var(--nav-surface);
  border-radius: 50%;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  font-size: 14px;
}

.eyebrow {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-muted);
}

.header-title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.5px;
}

.subtext {
  margin: 8px 0 32px 0;
  color: var(--color-muted);
  font-size: 15px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn.accent {
  background: var(--color-text);
  color: var(--nav-bg);
  border: none;
}

.btn.accent:hover {
  opacity: 0.9;
}

.btn.outline {
  background: var(--nav-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn.outline:hover {
  background: var(--color-hover);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
}

.card {
  background: var(--nav-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
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

.link {
  text-decoration: none;
}

.quick-actions .actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.skeleton-activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.charts {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 14px;
}

@media (max-width: 1100px) {
  .charts {
    grid-template-columns: 1fr;
  }

  .summary-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  .quick-actions .actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}
</style>
