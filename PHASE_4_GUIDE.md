# PHASE 4 GUIDE: Advanced Polish Components

## Overview

Phase 4 provides advanced features and utilities for professional data presentation and management:

- **ChartCard.vue** - Wrapper for chart library integration (Chart.js, ECharts, etc.)
- **BaseTooltip.vue** - Context-aware tooltips with positioning
- **BreadcrumbNav.vue** - Advanced breadcrumb navigation
- **BulkActions.vue** - Bulk selection and actions toolbar
- **useDataExporter.js** - Export data to CSV/JSON/Print

---

## Components & Utilities

### 1. ChartCard.vue

**Purpose:** Reusable chart container with loading/export/refresh

**Props:**

```javascript
{
  title: String (required),          // Chart title
  data: Array|Object,                // Chart data
  description: String,               // Footer description
  isLoading: Boolean (default: false),
  showExport: Boolean (default: true),   // Show export button
  showRefresh: Boolean (default: true)   // Show refresh button
}
```

**Emits:**

```javascript
'export' // Export chart/data
'refresh' // Refresh data
```

**Usage Example:**

```vue
<ChartCard
  title="Skills Distribution"
  :data="chartData"
  description="Total active skills by category"
  :is-loading="loading"
  @export="exportChart"
  @refresh="loadChartData"
>
  <!-- Chart.js integration example -->
  <template #default="{ data }">
    <canvas ref="chartCanvas"></canvas>
  </template>
</ChartCard>
```

**Features:**

- Animated loading state
- Empty state handling
- Export & refresh buttons
- CSS variables for dark/light mode
- Responsive grid layout

**Chart Library Integration (Chart.js Example):**

```vue
<template>
  <ChartCard
    title="Monthly Revenue"
    :data="revenueData"
    @refresh="refreshChart"
    @export="exportChart"
  >
    <template #default="{ data }">
      <canvas ref="chartCanvas"></canvas>
    </template>
  </ChartCard>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import ChartCard from '@/components/ui/ChartCard.vue'

const chartCanvas = ref(null)
const revenueData = ref(null)
let chartInstance = null

const loadChartData = async () => {
  // Fetch data from API
  revenueData.value = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [30, 59, 80, 81, 56, 55],
      },
    ],
  }
}

const initChart = () => {
  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: revenueData.value,
    options: { responsive: true, maintainAspectRatio: false },
  })
}

const refreshChart = () => {
  loadChartData().then(initChart)
}

onMounted(() => {
  loadChartData().then(initChart)
})

watch(() => revenueData.value, initChart)
</script>
```

---

### 2. BaseTooltip.vue

**Purpose:** Context tooltips with smart positioning

**Props:**

```javascript
{
  content: String,                   // Tooltip text
  position: String (default: 'top'), // top|bottom|left|right
  theme: String (default: 'dark'),   // dark|light
  triggerIcon: String (default: 'info-circle'),  // Bootstrap icon
  delay: Number (default: 0)         // Show delay in ms
}
```

**Slots:**

```vue
<template #trigger>
  <!-- Custom trigger element -->
</template>

<template #default>
  <!-- Custom tooltip content -->
</template>
```

**Usage Examples:**

**Simple Info Tooltip:**

```vue
<BaseTooltip content="Click to learn more about this field" position="top" />
```

**Custom Trigger:**

```vue
<BaseTooltip position="right" :delay="300">
  <template #trigger>
    <BaseButton variant="secondary" size="sm">
      <i class="bi bi-question-circle"></i>
    </BaseButton>
  </template>
  
  <template #default>
    <div>
      <strong>Help</strong>
      <p>This field requires a valid email address.</p>
    </div>
  </template>
</BaseTooltip>
```

**In Table Header:**

```vue
<th>
  Name
  <BaseTooltip content="Full name of the person" />
</th>
```

**Features:**

- Auto-positioning (smart collision detection)
- Smooth fade animations
- Dark/light theme variants
- Delay support for UX optimization
- Responsive positioning
- Keyboard accessible

---

### 3. BreadcrumbNav.vue

**Purpose:** Advanced breadcrumb navigation with icons

**Props:**

```javascript
{
  breadcrumbs: Array(required) // Breadcrumb items
}
```

**Breadcrumb Item Format:**

```javascript
{
  label: String (required),      // Display text
  path: String,                  // Route path (null for active)
  icon: String                   // Bootstrap icon name (optional)
}
```

**Usage Example:**

```vue
<BreadcrumbNav :breadcrumbs="breadcrumbs" />

<script setup>
const breadcrumbs = [
  { label: 'Dashboard', path: '/', icon: 'house' },
  { label: 'Skills', path: '/skills', icon: 'star' },
  { label: 'Details', path: null, icon: 'file-text' },
]
</script>
```

**Features:**

- Bootstrap icon support
- Active state indicator
- Responsive design
- Accessible navigation
- Smooth hover effects

---

### 4. BulkActions.vue

**Purpose:** Toolbar for bulk item selection/actions

**Props:**

```javascript
{
  selectedCount: Number (required),  // Number of selected items
  hasSelected: Boolean (required),   // Show/hide toolbar
  showDelete: Boolean (default: true),
  showExport: Boolean (default: true)
}
```

**Emits:**

```javascript
'delete' // Delete action (with confirmation)
'export' // Export action
'clear' // Clear selection
```

**Usage Example:**

```vue
<template>
  <BulkActions
    v-if="selectedItems.length > 0"
    :selected-count="selectedItems.length"
    :has-selected="selectedItems.length > 0"
    @delete="deleteSelected"
    @export="exportSelected"
    @clear="clearSelection"
  />

  <!-- Table with checkboxes -->
  <BaseTable :items="items">
    <template #column-checkbox="{ row }">
      <input type="checkbox" :checked="isSelected(row.id)" @change="toggleSelect(row.id)" />
    </template>
  </BaseTable>
</template>

<script setup>
import { ref } from 'vue'
import BulkActions from '@/components/ui/BulkActions.vue'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import { exportTableData } from '@/composables/useDataExporter'

const selectedItems = ref([])
const { success, error } = useToast()
const { show: confirm } = useConfirm()

const toggleSelect = (id) => {
  const index = selectedItems.value.indexOf(id)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(id)
  }
}

const deleteSelected = async () => {
  // Confirmation handled by BulkActions component
  // API call to delete items
  success(`Deleted ${selectedItems.value.length} items`)
  clearSelection()
}

const exportSelected = () => {
  const itemsToExport = items.filter((item) => selectedItems.value.includes(item.id))
  exportTableData(itemsToExport, 'csv', 'export')
  success('Data exported successfully')
}

const clearSelection = () => {
  selectedItems.value = []
}
</script>
```

**Features:**

- Animated appearance/disappearance
- Built-in confirmation for delete
- Item count display
- Custom action slots
- Responsive layout
- Mobile-friendly

---

### 5. useDataExporter.js

**Utility Functions:**

#### toCSV(data, headers)

Convert data to CSV format

```javascript
const csv = toCSV(items, ['name', 'email', 'status'])
```

#### toJSON(data, pretty)

Convert data to JSON format

```javascript
const json = toJSON(items, true)
```

#### downloadCSV(data, filename, headers)

Trigger CSV file download

```javascript
downloadCSV(skills, 'skills-export', ['id', 'name', 'category'])
```

#### downloadJSON(data, filename, pretty)

Trigger JSON file download

```javascript
downloadJSON(schools, 'schools-data')
```

#### generatePrintHTML(data, title, headers)

Generate print-friendly HTML

```javascript
const html = generatePrintHTML(items, 'Skills Report')
```

#### printData(data, title, headers)

Open print dialog

```javascript
printData(items, 'Skills Report', ['name', 'category', 'status'])
```

#### exportTableData(items, format, filename, columns)

High-level export function

```javascript
// Export to CSV
exportTableData(items, 'csv', 'skills-list', tableColumns)

// Export to JSON
exportTableData(items, 'json', 'skills-backup')

// Open print dialog
exportTableData(items, 'print', 'Skills Report')
```

**Complete Export Example:**

```vue
<template>
  <div>
    <BaseButton @click="handleExport"> <i class="bi bi-download"></i> Export </BaseButton>

    <!-- Export Format Menu -->
    <div class="export-menu">
      <button @click="exportAs('csv')">Export as CSV</button>
      <button @click="exportAs('json')">Export as JSON</button>
      <button @click="exportAs('print')">Print</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { exportTableData } from '@/composables/useDataExporter'
import { useToast } from '@/composables/useToast'

const items = ref([...])
const columns = ref([
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' }
])
const { success } = useToast()

const exportAs = (format) => {
  exportTableData(items.value, format, 'export', columns.value)
  if (format !== 'print') {
    success(`Exported as ${format.toUpperCase()}`)
  }
}
</script>
```

---

## Integration in CrudPageTemplate

**Enhanced CrudPageTemplate with Phase 4 features:**

```vue
<template>
  <div class="crud-page">
    <!-- Breadcrumbs -->
    <BreadcrumbNav :breadcrumbs="breadcrumbs" />

    <!-- Page Header with Tooltip -->
    <PageHeader :title="title" :description="description" @add="handleAdd">
      <template #actions>
        <BaseTooltip content="Add new item to the list" position="bottom">
          <template #trigger>
            <BaseButton variant="primary" @click="handleAdd">
              <i class="bi bi-plus-lg me-2"></i> Add New
            </BaseButton>
          </template>
        </BaseTooltip>
      </template>
    </PageHeader>

    <!-- Bulk Actions Toolbar -->
    <BulkActions
      :selected-count="selectedItems.length"
      :has-selected="selectedItems.length > 0"
      @delete="deleteBulk"
      @export="exportBulk"
      @clear="clearSelection"
    />

    <!-- Data Table with Checkboxes -->
    <BaseTable :items="items" @row-select="toggleSelect">
      <template #column-checkbox="{ row }">
        <input type="checkbox" :checked="isSelected(row.id)" @change="toggleSelect(row.id)" />
      </template>
    </BaseTable>

    <!-- Charts Row -->
    <div class="charts-grid">
      <ChartCard
        title="Status Distribution"
        :data="statusChartData"
        @export="exportChart"
        @refresh="loadCharts"
      >
        <template #default>
          <canvas ref="statusChart"></canvas>
        </template>
      </ChartCard>

      <ChartCard
        title="Category Breakdown"
        :data="categoryChartData"
        @export="exportChart"
        @refresh="loadCharts"
      >
        <template #default>
          <canvas ref="categoryChart"></canvas>
        </template>
      </ChartCard>
    </div>
  </div>
</template>
```

---

## Phase Completion Summary

**All Phases Now Complete:**

| Phase   | Components                                                         | Purpose                  |
| ------- | ------------------------------------------------------------------ | ------------------------ |
| Phase 1 | BaseToast, ConfirmDialog, LoadingSpinner                           | Feedback & Notifications |
| Phase 2 | BaseSelect, BaseTextarea, BaseCheckbox, FormGroup                  | Form Enhancements        |
| Phase 3 | BaseBadge, BaseSearch, PageHeader, ActionButtons, CrudPageTemplate | CRUD Templates           |
| Phase 4 | ChartCard, BaseTooltip, BreadcrumbNav, BulkActions                 | Advanced Polish          |

**Utility Composables:**

- `useToast.js` - Toast notifications
- `useConfirm.js` - Confirmation dialogs
- `useFormValidation.js` - Form validation
- `useDataExporter.js` - Data export functionality

---

## Next Steps

1. ✅ **All Components Created** - Ready for review
2. Review each component (1-7) to understand functionality
3. Integrate into actual CRUD pages
4. Test dark/light mode across all components
5. Optional: Add Chart.js, ECharts, or Apexcharts for visualizations

You now have a complete, production-ready component library! 🎉

| Phase   | Components                                                         | Purpose                  |
| ------- | ------------------------------------------------------------------ | ------------------------ |
| Phase 1 | BaseToast, ConfirmDialog, LoadingSpinner                           | Feedback & Notifications |
| Phase 2 | BaseSelect, BaseTextarea, BaseCheckbox, FormGroup                  | Form Enhancements        |
| Phase 3 | BaseBadge, BaseSearch, PageHeader, ActionButtons, CrudPageTemplate | CRUD Templates           |
| Phase 4 | ChartCard, BaseTooltip, BreadcrumbNav, BulkActions                 | Advanced Polish          |

**Utility Composables:**

- `useToast.js` - Toast notifications
- `useConfirm.js` - Confirmation dialogs
- `useFormValidation.js` - Form validation
- `useDataExporter.js` - Data export functionality

---

## Next Steps

1. ✅ **All Components Created** - Ready for review
2. Review each component (1-7) to understand functionality
3. Integrate into actual CRUD pages
4. Test dark/light mode across all components
5. Optional: Add Chart.js, ECharts, or Apexcharts for visualizations

You now have a complete, production-ready component library! 🎉
