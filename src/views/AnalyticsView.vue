<template>
  <div ref="analyticsRef" class="analytics-page">
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

    <section class="kpi-strip">
      <BaseCard class="kpi-card">
        <div class="kpi-label">Total Records</div>
        <div class="kpi-value">{{ dashboardStore.summaryData.totalRecords }}</div>
        <div class="kpi-meta">Across all content types</div>
      </BaseCard>
      <BaseCard class="kpi-card">
        <div class="kpi-label">Total Users</div>
        <div class="kpi-value">{{ dashboardStore.userStats.totalUsers }}</div>
      </BaseCard>
      <BaseCard class="kpi-card">
        <div class="kpi-label">New Users (30d)</div>
        <div class="kpi-value">{{ dashboardStore.userStats.newUsers }}</div>
        <div class="kpi-meta">Recent growth snapshot</div>
      </BaseCard>
      <BaseCard class="kpi-card">
        <div class="kpi-label">Data Accuracy</div>
        <div class="kpi-value">{{ dashboardStore.summaryData.dataAccuracy }}</div>
        <div class="kpi-meta">Sync speed {{ syncSpeed }}ms</div>
      </BaseCard>
    </section>

    <div class="analytics-grid">
      <div class="main-charts">
        <!-- Content Distribution -->
        <BaseCard class="analytics-card">
          <DonutChart :data="distributionData" :is-loading="dashboardStore.isLoading" />
        </BaseCard>

        <!-- Growth Trends -->
        <LineChart title="Monthly Growth" subtitle="Users and content growth trend" icon="bi-activity"
          :labels="growthLabels" :series="growthData" :is-loading="dashboardStore.isLoading" />
      </div>

      <!-- Distribution Metrics -->
      <div class="side-metrics">
        <BaseCard class="analytics-card pulse-card">
          <div class="pulse-head">
            <span>System Pulse</span>
            <span class="pulse-badge">Live</span>
          </div>
          <div class="pulse-metrics">
            <div class="pulse-item">
              <span class="label">New Users (30d)</span>
              <strong class="value">{{ dashboardStore.userStats.newUsers }}</strong>
            </div>
            <div class="pulse-item">
              <span class="label">Active Categories</span>
              <strong class="value">{{ dashboardStore.categories.length }}</strong>
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
                <div class="mini-fill"
                  :style="{ width: (item.value / totalCount) * 100 + '%', backgroundColor: item.color }"></div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <section class="analytics-insights-grid">
      <BaseCard class="analytics-card insight-card">
        <template #header>
          <div class="section-title">
            <i class="bi bi-funnel"></i>
            <span>User Funnel</span>
          </div>
        </template>
        <div class="metric-list">
          <div class="metric-row">
            <span>Total Users</span>
            <strong>{{ dashboardStore.userStats.totalUsers }}</strong>
          </div>
          <div class="metric-row">
            <span>New Users (30d)</span>
            <strong>{{ dashboardStore.userStats.newUsers }}</strong>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="analytics-card insight-card">
        <template #header>
          <div class="section-title">
            <i class="bi bi-calendar-range"></i>
            <span>Retention Snapshot</span>
          </div>
        </template>
        <div class="metric-list">
          <div class="metric-row">
            <span>Last 7 days</span>
            <strong>{{ cohortStats.last7 }}</strong>
          </div>
          <div class="metric-row">
            <span>Last 30 days</span>
            <strong>{{ cohortStats.last30 }}</strong>
          </div>
          <div class="metric-row">
            <span>Last 90 days</span>
            <strong>{{ cohortStats.last90 }}</strong>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="analytics-card insight-card">
        <template #header>
          <div class="section-title">
            <i class="bi bi-graph-up"></i>
            <span>Growth Rate</span>
          </div>
        </template>
        <div class="metric-list">
          <div class="metric-row">
            <span>Week over week</span>
            <strong>{{ growthRates.weekly }}%</strong>
          </div>
          <div class="metric-row">
            <span>Month over month</span>
            <strong>{{ growthRates.monthly }}%</strong>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="analytics-card insight-card">
        <template #header>
          <div class="section-title">
            <i class="bi bi-diagram-3"></i>
            <span>User Segments</span>
          </div>
        </template>
        <div class="metric-list">
          <div class="metric-row">
            <span>Profiles with phone</span>
            <strong>{{ segmentStats.withPhone }}</strong>
          </div>
          <div class="metric-row">
            <span>Profiles with portfolio</span>
            <strong>{{ segmentStats.withPortfolio }}</strong>
          </div>
          <div class="metric-row">
            <span>Profiles with CV</span>
            <strong>{{ segmentStats.withCv }}</strong>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="analytics-card insight-card">
        <template #header>
          <div class="section-title">
            <i class="bi bi-stars"></i>
            <span>Top Entities</span>
          </div>
        </template>
        <div class="mini-list">
          <div class="mini-group">
            <span class="mini-title">Skills</span>
            <div class="chip" v-for="item in topSkills" :key="item.id">{{ item.name }}</div>
          </div>
          <div class="mini-group">
            <span class="mini-title">Subjects</span>
            <div class="chip" v-for="item in topSubjects" :key="item.id">{{ item.name }}</div>
          </div>
          <div class="mini-group">
            <span class="mini-title">Categories</span>
            <div class="chip" v-for="item in topCategories" :key="item.id">{{ item.name }}</div>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="analytics-card insight-card">
        <template #header>
          <div class="section-title">
            <i class="bi bi-geo-alt"></i>
            <span>Users by City</span>
          </div>
        </template>
        <div class="metric-list">
          <div v-for="city in topCities" :key="city.name" class="metric-row">
            <span>{{ city.name }}</span>
            <strong>{{ city.count }}</strong>
          </div>
          <div v-if="!topCities.length" class="empty-state">No city data available</div>
        </div>
      </BaseCard>

      <BaseCard class="analytics-card insight-card">
        <template #header>
          <div class="section-title">
            <i class="bi bi-heart-pulse"></i>
            <span>Operational Health</span>
          </div>
        </template>
        <div class="metric-list">
          <div class="metric-row">
            <span>API Status</span>
            <strong :class="healthStatus.class">{{ healthStatus.label }}</strong>
          </div>
          <div class="metric-row">
            <span>Last Refresh</span>
            <strong>{{ lastRefreshLabel }}</strong>
          </div>
          <div class="metric-row">
            <span>Sync Speed</span>
            <strong>{{ syncSpeed }}ms</strong>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="analytics-card insight-card">
        <template #header>
          <div class="section-title">
            <i class="bi bi-clock"></i>
            <span>Data Freshness</span>
          </div>
        </template>
        <div class="metric-list">
          <div v-for="item in freshnessData" :key="item.label" class="metric-row">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
      </BaseCard>
    </section>

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
          <div v-for="cat in dashboardStore.categories.slice(0, 6)" :key="cat.id" class="category-pill-item">
            <span class="dot-sm"></span>
            <span class="name">{{ cat.name }}</span>
          </div>
          <div v-if="!dashboardStore.categories.length" class="empty-state">No categories defined</div>
        </div>
      </BaseCard>

      <BaseCard class="analytics-card newest-users">
        <template #header>
          <div class="section-title">
            <i class="bi bi-people"></i>
            <span>Newest Users</span>
          </div>
        </template>
        <div class="user-list">
          <div v-for="user in dashboardStore.newestUsers" :key="user.id" class="user-row">
            <img class="user-avatar" :src="getAvatarUrl(user.avatar)" :alt="user.full_name" />
            <div class="user-info">
              <span class="user-name">{{ user.full_name }}</span>
              <span class="user-email">{{ user.email }}</span>
            </div>
          </div>
          <div v-if="!dashboardStore.newestUsers.length" class="empty-state">No recent users</div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import BaseCard from '@/components/ui/base/BaseCard.vue'
import DonutChart from '@/components/charts/DonutChart.vue'
import LineChart from '@/components/charts/LineChart.vue'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()
const syncSpeed = ref(149)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://novia2.csm.linkpc.net'
const lastRefresh = ref(null)
const analyticsRef = ref(null)

onMounted(() => {
  if (!dashboardStore.skills.length) {
    dashboardStore.fetchDashboardData().finally(() => {
      lastRefresh.value = new Date()
    })
    return
  }
  lastRefresh.value = new Date()
})

const distributionData = computed(() => [
  { label: 'Users', value: dashboardStore.users.length || 0, color: '#3b82f6' },
  { label: 'Skills', value: dashboardStore.skills.length || 0, color: '#22c55e' },
  { label: 'Schools', value: dashboardStore.schools.length || 0, color: '#f59e0b' },
  { label: 'Subjects', value: dashboardStore.subjects.length || 0, color: '#6366f1' },
  { label: 'Degrees', value: dashboardStore.degrees.length || 0, color: '#ec4899' },
  { label: 'Categories', value: dashboardStore.categories.length || 0, color: '#10b981' },
])

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

const growthLabels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


const totalCount = computed(() => {
  return distributionData.value.reduce((acc, curr) => acc + curr.value, 0) || 14
})


const getDateDaysAgo = (days) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

const countUsersSince = (days) => {
  const since = getDateDaysAgo(days)
  return dashboardStore.users.filter((u) => u.created_at && new Date(u.created_at) >= since).length
}

const countUsersBetween = (start, end) => {
  return dashboardStore.users.filter((u) => {
    if (!u.created_at) return false
    const created = new Date(u.created_at)
    return created >= start && created < end
  }).length
}

const cohortStats = computed(() => ({
  last7: countUsersSince(7),
  last30: countUsersSince(30),
  last90: countUsersSince(90),
}))

const growthRates = computed(() => {
  const end = new Date()
  const start7 = getDateDaysAgo(7)
  const prev7 = getDateDaysAgo(14)
  const current7 = countUsersBetween(start7, end)
  const previous7 = countUsersBetween(prev7, start7)
  const weekly = previous7 ? Math.round(((current7 - previous7) / previous7) * 100) : (current7 ? 100 : 0)

  const start30 = getDateDaysAgo(30)
  const prev30 = getDateDaysAgo(60)
  const current30 = countUsersBetween(start30, end)
  const previous30 = countUsersBetween(prev30, start30)
  const monthly = previous30 ? Math.round(((current30 - previous30) / previous30) * 100) : (current30 ? 100 : 0)

  return { weekly, monthly }
})

const segmentStats = computed(() => {
  const users = dashboardStore.users
  return {
    withPhone: users.filter((u) => u.phone).length,
    withPortfolio: users.filter((u) => u.portfolio_link).length,
    withCv: users.filter((u) => u.cv).length,
  }
})

const getRecentItems = (items) => {
  return [...items]
    .filter((item) => item && (item.created_at || item.updated_at))
    .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
    .slice(0, 3)
}

const topSkills = computed(() => getRecentItems(dashboardStore.skills))
const topSubjects = computed(() => getRecentItems(dashboardStore.subjects))
const topCategories = computed(() => getRecentItems(dashboardStore.categories))

const topCities = computed(() => {
  const counts = new Map()
  dashboardStore.users.forEach((u) => {
    if (!u.current_city) return
    counts.set(u.current_city, (counts.get(u.current_city) || 0) + 1)
  })
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

const getLatestDate = (items) => {
  const timestamps = items
    .map((item) => item.updated_at || item.created_at)
    .filter(Boolean)
    .map((value) => new Date(value))
  if (!timestamps.length) return null
  return new Date(Math.max(...timestamps.map((d) => d.getTime())))
}

const formatRelativeDate = (date) => {
  if (!date) return 'No data'
  const diffMs = Date.now() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return '1 day ago'
  return `${diffDays} days ago`
}

const freshnessData = computed(() => [
  { label: 'Users', value: formatRelativeDate(getLatestDate(dashboardStore.users)) },
  { label: 'Skills', value: formatRelativeDate(getLatestDate(dashboardStore.skills)) },
  { label: 'Schools', value: formatRelativeDate(getLatestDate(dashboardStore.schools)) },
  { label: 'Subjects', value: formatRelativeDate(getLatestDate(dashboardStore.subjects)) },
  { label: 'Degrees', value: formatRelativeDate(getLatestDate(dashboardStore.degrees)) },
  { label: 'Categories', value: formatRelativeDate(getLatestDate(dashboardStore.categories)) },
])

const healthStatus = computed(() => {
  if (dashboardStore.isLoading) return { label: 'Syncing', class: 'status-syncing' }
  if (dashboardStore.error) return { label: 'Degraded', class: 'status-degraded' }
  return { label: 'Healthy', class: 'status-healthy' }
})

const lastRefreshLabel = computed(() => {
  if (!lastRefresh.value) return 'Not yet synced'
  return formatRelativeDate(lastRefresh.value)
})

const getAvatarUrl = (avatar) => {
  if (!avatar || avatar === 'no_photo.jpg') {
    return '/images/avatar/avatar-illustrated-01.png'
  }
  return `${API_BASE_URL}/storage/avatars/${avatar}`
}

const exportHighRes = async () => {
  if (!analyticsRef.value) return
  await nextTick()

  const source = analyticsRef.value
  const sourceCanvases = source.querySelectorAll('canvas')
  const canvasImages = Array.from(sourceCanvases).map(canvas => {
    return canvas.toDataURL('image/png', 1.0)
  })

  const clone = source.cloneNode(true)
  const cloneCanvases = clone.querySelectorAll('canvas')
  cloneCanvases.forEach((canvas, index) => {
    const img = document.createElement('img')
    img.src = canvasImages[index]
    img.style.width = '100%'
    img.style.height = 'auto'
    canvas.replaceWith(img)
  })

  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(node => node.outerHTML)
    .join('\n')

  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Please allow popups for this website to export the report.')
    return
  }

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light'
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  printWindow.document.open()
  printWindow.document.write(`
    <!DOCTYPE html>
    <html data-theme="${currentTheme}">
    <head>
      <title>Analytics Report - ${today}</title>
      <meta charset="UTF-8">
      ${styles}
      <style>
        @page { size: auto; margin: 20mm 15mm; }
        body {
          background: var(--color-background, #fff) !important;
          color: var(--color-text, #000) !important;
          margin: 0;
          padding: 0;
          font-family: 'Inter', -apple-system, sans-serif;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .analytics-page {
          display: block !important;
          padding: 20px !important;
          max-width: 1100px;
          margin: 0 auto;
          flex-grow: 1;
        }
        .header-actions, .btn, .eyebrow-wrapper .icon-circle { display: none !important; }
        .custom-header {
          border-bottom: 2px solid var(--color-border, #eee) !important;
          margin-bottom: 30px !important;
          padding: 20px 0 !important;
          background: transparent !important;
        }
        .analytics-card {
          break-inside: avoid;
          margin-bottom: 25px !important;
          border: 1px solid var(--color-border, #eee) !important;
          box-shadow: none !important;
          background: var(--nav-bg, #fff) !important;
        }
        .report-footer {
          margin-top: 40px;
          padding: 20px;
          border-top: 1px solid var(--color-border, #eee);
          text-align: center;
          font-size: 11px;
          color: var(--color-muted, #666);
          break-before: auto;
        }
        .kpi-strip {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 20px !important;
          margin-bottom: 30px !important;
        }
        .analytics-grid {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 25px !important;
          margin-bottom: 30px !important;
        }
        .analytics-insights-grid {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 20px !important;
          margin-bottom: 30px !important;
        }
        .analytics-footer-grid {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 25px !important;
        }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        .metric-row strong { color: var(--color-text, #000) !important; }
      </style>
    </head>
    <body class="printable-report">
      <div id="report-content" class="analytics-page"></div>
      <footer class="report-footer">
        Generated on ${today} • NextGen Analytics System
      </footer>
    </body>
    </html>
  `)
  printWindow.document.close()

  const reportContainer = printWindow.document.getElementById('report-content')
  if (reportContainer) {
    reportContainer.innerHTML = clone.innerHTML
  }

  const script = printWindow.document.createElement('script')
  script.textContent = `
    window.onload = () => {
      setTimeout(() => {
        window.focus();
        window.print();
        window.close();
      }, 1000);
    };
  `
  printWindow.document.body.appendChild(script)
}
</script>

<style scoped>
/* Print Styles for high-quality PDF export */
@media print {

  .header-actions,
  .btn,
  .eyebrow-wrapper,
  .subtext {
    display: none !important;
  }

  .analytics-page {
    display: block !important;
    padding: 0 !important;
    gap: 15px !important;
    color: #000 !important;
    background: #fff !important;
  }

  .kpi-strip,
  .analytics-grid,
  .analytics-insights-grid,
  .analytics-footer-grid {
    display: block !important;
    width: 100% !important;
  }

  .kpi-card,
  .analytics-card {
    background: #fff !important;
    color: #000 !important;
    page-break-inside: avoid;
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

  .analytics-grid,
  .analytics-footer-grid {
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
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.analytics-insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.metric-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: var(--color-muted);
}

.metric-row strong {
  color: var(--color-text);
  font-weight: 700;
}

.mini-list {
  display: grid;
  gap: 12px;
}

.mini-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mini-title {
  width: 100%;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-muted);
}

.chip {
  background: var(--nav-surface);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  color: var(--color-text);
}

.status-healthy {
  color: #22c55e;
}

.status-degraded {
  color: #ef4444;
}

.status-syncing {
  color: #eab308;
}

.kpi-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
}

.kpi-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kpi-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-muted);
}

.kpi-value {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-text);
}

.kpi-meta {
  font-size: 12px;
  color: var(--color-muted);
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

.main-charts,
.side-metrics {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pulse-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 12px;
}

.pulse-badge {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.pulse-metrics {
  display: grid;
  gap: 10px;
}

.pulse-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--nav-surface);
}

.pulse-item .label {
  font-size: 13px;
  color: var(--color-muted);
}

.pulse-item .value {
  font-size: 14px;
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

.user-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-row {
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 12px;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: var(--nav-surface);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.user-email {
  font-size: 12px;
  color: var(--color-muted);
}


@media (max-width: 1024px) {
  .analytics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
