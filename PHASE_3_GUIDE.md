# PHASE 3 GUIDE: CRUD Template Components

## Overview

Phase 3 provides the most powerful component: **CrudPageTemplate** - a master template that eliminates ~80% of CRUD page code duplication. Combined with utility components (Badge, Search, PageHeader, ActionButtons), you can now create full CRUD pages with minimal code.

---

## Components Created

### 1. BaseBadge.vue

**Purpose:** Status indicator badges with multiple variants

**Props:**

```javascript
{
  label: String (required),           // Badge text
  variant: String (default: 'secondary'),  // primary|secondary|success|danger|warning|info|light|dark
  size: String (default: 'md'),       // sm|md|lg
  icon: String                        // Bootstrap icon name (e.g., 'check-circle')
}
```

**Usage Example:**

```vue
<template>
  <div>
    <!-- Status badges -->
    <BaseBadge label="Active" variant="success" icon="check-circle" />
    <BaseBadge label="Pending" variant="warning" />
    <BaseBadge label="Inactive" variant="danger" />

    <!-- Size variants -->
    <BaseBadge label="Small" size="sm" variant="info" />
    <BaseBadge label="Medium" size="md" variant="primary" />
    <BaseBadge label="Large" size="lg" variant="success" />
  </div>
</template>
```

**CSS Variables:**

- Dark/Light mode support via Bootstrap colors (hardcoded for reliability)
- Hover effects with smooth transitions
- Responsive sizing

---

### 2. BaseSearch.vue

**Purpose:** Search/filter input with clear button

**Props:**

```javascript
{
  modelValue: String (default: ''),    // v-model binding
  placeholder: String (default: 'Search...'),
  showClear: Boolean (default: true)  // Show X button when has value
}
```

**Emits:**

```javascript
'update:modelValue' // On input change
'search' // On Enter key press
```

**Usage Example:**

```vue
<template>
  <BaseSearch v-model="searchQuery" placeholder="Search by name..." @search="handleSearch" />
</template>

<script setup>
import { ref } from 'vue'
import BaseSearch from '@/components/ui/BaseSearch.vue'

const searchQuery = ref('')

const handleSearch = () => {
  console.log('Search for:', searchQuery.value)
  // Trigger API call or filter
}
</script>
```

**Features:**

- Search icon on left
- Clear button (X) appears when text entered
- Enter key triggers search event
- CSS variables for dark/light mode
- Responsive design

---

### 3. PageHeader.vue

**Purpose:** Page title with breadcrumbs and add button

**Props:**

```javascript
{
  title: String (required),           // Page title
  description: String,                // Optional subtitle/description
  breadcrumbs: Array,                 // Breadcrumb navigation items
  showAddButton: Boolean (default: true),
  hideAddButton: Boolean (default: false),  // Override to hide button
  addButtonText: String (default: 'Add New')
}
```

**Breadcrumbs Format:**

```javascript
;[
  { label: 'Dashboard', path: '/' },
  { label: 'Skills', path: '/skills' },
  { label: 'List', path: '/skills/list' },
]
```

**Emits:**

```javascript
'add' // When add button clicked
```

**Usage Example:**

```vue
<template>
  <PageHeader
    title="Manage Skills"
    description="Create, edit, and manage skill categories"
    :breadcrumbs="breadcrumbs"
    add-button-text="New Skill"
    @add="openAddModal"
  />
</template>

<script setup>
const breadcrumbs = [
  { label: 'Dashboard', path: '/' },
  { label: 'Skills', path: '/skills' },
  { label: 'List', path: '/skills' },
]

const openAddModal = () => {
  // Open form modal
}
</script>
```

**Slot:**

```vue
<PageHeader :title="title">
  <template #actions>
    <!-- Custom action buttons instead of default Add button -->
    <BaseButton @click="exportData">Export</BaseButton>
  </template>
</PageHeader>
```

---

### 4. ActionButtons.vue

**Purpose:** Table action buttons (View/Edit/Delete)

**Props:**

```javascript
{
  showView: Boolean (default: true),
  showEdit: Boolean (default: true),
  showDelete: Boolean (default: true)
}
```

**Emits:**

```javascript
'view' // View icon clicked
'edit' // Edit icon clicked
'delete' // Delete icon clicked
```

**Usage Example:**

```vue
<!-- Inside BaseTable row template -->
<template #actions="{ row }">
  <ActionButtons @view="viewItem(row.id)" @edit="editItem(row.id)" @delete="deleteItem(row.id)" />
</template>

<!-- With custom buttons -->
<ActionButtons :show-delete="false">
  <button class="action-btn" @click="exportItem">
    <i class="bi bi-download"></i>
  </button>
</ActionButtons>
```

**Styling:**

- Hover effects with color changes (blue/green/red)
- Smooth transitions and lift animation
- Disabled state support
- Icon-only buttons (32px × 32px)

---

### 5. EmptyState.vue

**Purpose:** Display when no data available

**Props:**

```javascript
{
  icon: String (default: 'inbox'),    // Bootstrap icon name
  title: String (required),           // Main message
  message: String (required),         // Description
  showAction: Boolean (default: false)
}
```

**Usage Example:**

```vue
<EmptyState
  icon="inbox"
  title="No Skills Found"
  message="Create a new skill to get started"
  :show-action="true"
>
  <template #action>
    <BaseButton @click="openAddModal">Create Skill</BaseButton>
  </template>
</EmptyState>
```

---

### 6. CrudPageTemplate.vue ⭐ (MASTER COMPONENT)

**Purpose:** Complete CRUD page template - single component replaces entire page implementation

**Props:**

```javascript
{
  // Page Configuration
  title: String (required),              // Page title
  description: String,                   // Optional subtitle
  breadcrumbs: Array,                    // Breadcrumb navigation

  // Button Configuration
  addButtonText: String (default: 'Add New'),

  // Search Configuration
  showSearch: Boolean (default: true),
  searchPlaceholder: String (default: 'Search...'),
  searchFields: Array (default: ['name']),  // Fields to search in

  // Table Configuration
  columns: Array (required),             // Column definitions
  items: Array (default: []),            // Data items
  isLoading: Boolean (default: false),

  // Pagination Configuration
  showPagination: Boolean (default: true),
  itemsPerPage: Number (default: 10),

  // Modal Configuration
  modalTitle: String (default: 'Form'),
  detailModalTitle: String (default: 'Details'),

  // Messages
  emptyStateMessage: String (default: 'No items found. Create one to get started.')
}
```

**Emits:**

```javascript
'add' // Add button clicked
'edit' // Edit action triggered
'delete' // Delete action triggered
'view' // View action triggered
'search' // Search executed
```

**Slots:**

```vue
<template #form="{ item, close }">
  <!-- Form for add/edit - item is null for add, populated for edit -->
  <BaseForm :item="item" @submit="saveItem" @cancel="close" />
</template>

<template #detail="{ item, close }">
  <!-- Detail view modal content -->
  <ItemDetails :item="item" @close="close" />
</template>

<!-- Other slots for table column customization -->
<template #column-name="{ row }">
  {{ row.name }}
</template>
```

**Exposed Methods:**

```javascript
// Programmatically control modals
openModal() // Open add/edit form
closeModal()
openDetailModal(id) // Open view detail
closeDetailModal()
```

---

## COMPLETE EXAMPLE: Skills CRUD Page

### Old Way (Before Phase 3): ~250 lines per page

```vue
<!-- ❌ Old way - lots of boilerplate -->
<template>
  <div>
    <div class="header">
      <h1>Skills</h1>
      <button @click="openModal">Add New</button>
    </div>
    <div>
      <input v-model="search" placeholder="Search..." />
    </div>
    <BaseTable :columns="columns" :items="filteredItems" />
    <BasePagination :current-page="page" :total-pages="totalPages" />
    <BaseModal v-if="showModal" @close="closeModal">
      <!-- Form component -->
    </BaseModal>
  </div>
</template>

<script setup>
// ~100+ lines of state and logic management
</script>
```

### New Way (With Phase 3): ~50 lines total

```vue
<template>
  <CrudPageTemplate
    title="Manage Skills"
    description="Create and manage skill categories"
    :breadcrumbs="breadcrumbs"
    add-button-text="New Skill"
    :columns="columns"
    :items="skills"
    :is-loading="loading"
    search-placeholder="Search skills..."
    :search-fields="['name', 'category']"
    @add="handleAdd"
    @edit="handleEdit"
    @delete="handleDelete"
    @search="handleSearch"
  >
    <!-- Form for add/edit -->
    <template #form="{ item, close }">
      <SkillForm :skill="item" @save="saveSkill(item, close)" @cancel="close" />
    </template>

    <!-- Detail view -->
    <template #detail="{ item, close }">
      <SkillDetail :skill="item" @close="close" />
    </template>

    <!-- Custom status column -->
    <template #column-status="{ row }">
      <BaseBadge :label="row.status" :variant="row.status === 'active' ? 'success' : 'danger'" />
    </template>
  </CrudPageTemplate>
</template>

<script setup>
import { ref } from 'vue'
import CrudPageTemplate from '@/components/common/CrudPageTemplate.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import SkillForm from '@/components/form/SkillForm.vue'
import SkillDetail from '@/components/views/SkillDetail.vue'

const breadcrumbs = [
  { label: 'Dashboard', path: '/' },
  { label: 'Skills', path: '/skills' },
]

const columns = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions', width: '120px' },
]

const skills = ref([])
const loading = ref(false)

const handleAdd = () => {
  // Triggered when "Add New" clicked
}

const handleEdit = (skill) => {
  // Form modal opens with skill data
}

const handleDelete = (id) => {
  // Handle deletion
}

const saveSkill = async (skill, close) => {
  // API call to save
  close()
}

const handleSearch = (query) => {
  // API call with search query
}
</script>
```

---

## Integration Steps

### 1. Update Column Definitions

```javascript
const columns = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'status', label: 'Status', align: 'center' },
  { key: 'actions', label: 'Actions', width: '120px', align: 'center' },
]
```

### 2. Define Search Fields

```javascript
// Only searches in these fields
const searchFields = ['name', 'description', 'category']
```

### 3. Implement Form Component

```vue
<SkillForm :skill="skill" @save="saveSkill" @cancel="closeForm" />
```

### 4. Add Custom Column Templates

```vue
<template #column-status="{ row }">
  <BaseBadge :label="row.status" :variant="getStatusVariant(row.status)" />
</template>
```

---

## Dark/Light Mode Support

All Phase 3 components use CSS variables:

- `var(--color-text)` - Text color
- `var(--color-background)` - Background
- `var(--color-secondary)` - Secondary background
- `var(--color-border)` - Border color
- `var(--color-muted)` - Muted text

No additional configuration needed - automatic theme switching!

---

## Migration Checklist

For each CRUD page (Skills, Schools, Degrees, Subjects, Categories):

- [ ] Import CrudPageTemplate
- [ ] Define columns array
- [ ] Define searchFields array
- [ ] Create breadcrumbs array
- [ ] Set up API service integration
- [ ] Create/update form component
- [ ] Create detail view component
- [ ] Implement @add, @edit, @delete, @search handlers
- [ ] Add custom column templates as needed
- [ ] Test dark/light mode

---

## Best Practices

1. **Search Fields:** Keep to 2-3 fields for performance
2. **Items Per Page:** 10-25 depending on row height
3. **Loading State:** Set `isLoading` during API calls
4. **Error Handling:** Use useToast() from Phase 1 for errors
5. **Form Validation:** Use useFormValidation() from Phase 2
6. **Confirmation:** Use useConfirm() from Phase 1 for delete actions

---

## Next Steps

Phase 4 (Optional Polish):

- Advanced Charts component
- Tooltip component
- Advanced Filter component
- Export to PDF/CSV utilities
- Bulk action support

All Phase 3 components are now ready! You can immediately start creating CRUD pages using CrudPageTemplate.

---

## Best Practices

1. **Search Fields:** Keep to 2-3 fields for performance
2. **Items Per Page:** 10-25 depending on row height
3. **Loading State:** Set `isLoading` during API calls
4. **Error Handling:** Use useToast() from Phase 1 for errors
5. **Form Validation:** Use useFormValidation() from Phase 2
6. **Confirmation:** Use useConfirm() from Phase 1 for delete actions

---

## Next Steps

Phase 4 (Optional Polish):

- Advanced Charts component
- Tooltip component
- Advanced Filter component
- Export to PDF/CSV utilities
- Bulk action support

All Phase 3 components are now ready! You can immediately start creating CRUD pages using CrudPageTemplate.
