# Phase 1: Core Feedback Components Guide

Complete implementation of **BaseToast + ToastContainer + useToast**, **ConfirmDialog + useConfirm**, and **LoadingSpinner**.

---

## 📋 What Was Created

### Composables

- ✅ `src/composables/useToast.js` - Toast management
- ✅ `src/composables/useConfirm.js` - Confirmation dialog management

### Components

- ✅ `src/components/ui/base/BaseToast.vue` - Individual toast
- ✅ `src/components/ui/ToastContainer.vue` - Toast manager
- ✅ `src/components/ui/base/ConfirmDialog.vue` - Confirmation dialog
- ✅ `src/components/ui/LoadingSpinner.vue` - Loading spinner

### Updated

- ✅ `src/App.vue` - Added ToastContainer and ConfirmDialog globally

---

## 🎯 Usage Examples

### 1. Toast Notifications

#### Show Success Toast

```javascript
import { useToast } from '@/composables/useToast'

export default {
  setup() {
    const { success, error, warning, info } = useToast()

    const handleCreate = async () => {
      try {
        await createSkill(formData)
        success('Skill created successfully!') // Auto-closes in 3s
      } catch (err) {
        error('Failed to create skill') // Auto-closes in 5s
      }
    }

    return { handleCreate }
  },
}
```

#### Available Toast Methods

```javascript
const {
  success, // Green toast, 3s duration
  error, // Red toast, 5s duration
  warning, // Yellow toast, 4s duration
  info, // Blue toast, 3s duration
  add, // Custom toast with full options
  remove, // Remove specific toast by ID
  clear, // Clear all toasts
} = useToast()

// Usage
success('Operation completed!')
error('Something went wrong', 5000) // Custom duration
warning('Please review this', 4000)
info('New update available', 3000)

// Advanced usage with add()
const toastId = add({
  message: 'Processing...',
  type: 'info',
  duration: 0, // No auto-close
})

// Later, remove manually
remove(toastId)
```

#### Composition API (Recommended)

```vue
<template>
  <button @click="handleSubmit">Submit</button>
</template>

<script setup>
import { useToast } from '@/composables/useToast'

const { success, error } = useToast()

const handleSubmit = async () => {
  try {
    // ... do something
    success('Changes saved!')
  } catch (err) {
    error('Failed to save: ' + err.message)
  }
}
</script>
```

---

### 2. Confirmation Dialog

#### Basic Confirmation

```javascript
import { useConfirm } from '@/composables/useConfirm'

export default {
  setup() {
    const { show } = useConfirm()
    const { success } = useToast()

    const handleDelete = () => {
      show({
        title: 'Delete Skill?',
        message: 'This action cannot be undone',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger',
        onConfirm: async () => {
          await deleteSkill(id)
          success('Skill deleted!')
        },
        onCancel: () => {
          console.log('Delete cancelled')
        },
      })
    }

    return { handleDelete }
  },
}
```

#### With Composition API

```vue
<template>
  <button @click="handleDeleteSkill">Delete</button>
</template>

<script setup>
import { useConfirm } from '@/composables/useConfirm'
import { useToast } from '@/composables/useToast'

const { show } = useConfirm()
const { success, error } = useToast()

const handleDeleteSkill = () => {
  show({
    title: 'Delete Skill?',
    message: 'Are you sure you want to delete this skill? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'danger',
    onConfirm: async () => {
      try {
        await deleteSkill(skillId)
        success('Skill deleted successfully!')
      } catch (err) {
        error('Failed to delete skill')
      }
    },
  })
}
</script>
```

#### Confirmation Types

```javascript
show({
  type: 'warning', // Yellow - Default (Be careful)
  // or
  type: 'danger', // Red (Destructive action)
  // or
  type: 'info', // Blue (Informational)
})
```

---

### 3. Loading Spinner

#### Inline Spinner (In a section)

```vue
<template>
  <div>
    <LoadingSpinner v-if="isLoading" label="Loading data..." size="md" variant="primary" />
    <div v-else>Content</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const isLoading = ref(true)
</script>
```

#### Spinner Sizes

```vue
<!-- Small (6px dots) -->
<LoadingSpinner size="sm" label="Loading..." />

<!-- Medium (10px dots) -->
<LoadingSpinner size="md" label="Processing..." />

<!-- Large (14px dots) -->
<LoadingSpinner size="lg" label="Please wait..." />
```

#### Spinner Colors

```vue
<LoadingSpinner variant="primary" />
<!-- Blue -->
<LoadingSpinner variant="secondary" />
<!-- Gray -->
<LoadingSpinner variant="success" />
<!-- Green -->
<LoadingSpinner variant="danger" />
<!-- Red -->
<LoadingSpinner variant="warning" />
<!-- Yellow -->
<LoadingSpinner variant="info" />
<!-- Cyan -->
```

#### Full Page Loading

```vue
<template>
  <LoadingSpinner
    v-if="isPageLoading"
    label="Loading..."
    size="lg"
    variant="primary"
    class="fullpage"
  />
</template>
```

---

## 📊 Real-World Example: CRUD Operations

### Skills Management with All Feedback Components

```vue
<template>
  <div>
    <!-- Loading state -->
    <LoadingSpinner v-if="isTableLoading" label="Loading skills..." />

    <!-- Table content -->
    <BaseTable
      v-else
      :columns="columns"
      :items="skills"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Edit Modal -->
    <BaseModal v-if="showEditModal" title="Edit Skill" @close="showEditModal = false">
      <BaseForm @submit="handleSaveSkill">
        <BaseInput v-model="form.name" label="Skill Name" />
        <BaseButton type="submit">Save</BaseButton>
      </BaseForm>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import { getSkills, updateSkill, deleteSkill } from '@/api/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import BaseTable from '@/components/ui/base/BaseTable.vue'
import BaseModal from '@/components/ui/base/BaseModal.vue'
import BaseForm from '@/components/form/BaseForm.vue'
import BaseInput from '@/components/ui/base/BaseInput.vue'
import BaseButton from '@/components/ui/base/BaseButton.vue'

const { success, error } = useToast()
const { show: showConfirm } = useConfirm()

const isTableLoading = ref(false)
const showEditModal = ref(false)
const skills = ref([])
const form = ref({ name: '' })
const editingId = ref(null)

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
]

onMounted(async () => {
  await fetchSkills()
})

const fetchSkills = async () => {
  try {
    isTableLoading.value = true
    const response = await getSkills()
    skills.value = response.data
  } catch (err) {
    error('Failed to load skills')
  } finally {
    isTableLoading.value = false
  }
}

const handleEdit = (id) => {
  editingId.value = id
  const skill = skills.value.find((s) => s.id === id)
  form.value = { ...skill }
  showEditModal.value = true
}

const handleDelete = (id) => {
  showConfirm({
    title: 'Delete Skill?',
    message: 'This skill will be permanently deleted.',
    confirmText: 'Delete',
    type: 'danger',
    onConfirm: async () => {
      try {
        await deleteSkill(id)
        success('Skill deleted!')
        await fetchSkills()
      } catch (err) {
        error('Failed to delete skill')
      }
    },
  })
}

const handleSaveSkill = async () => {
  try {
    await updateSkill(editingId.value, form.value)
    success('Skill updated!')
    showEditModal.value = false
    await fetchSkills()
  } catch (err) {
    error('Failed to update skill')
  }
}
</script>
```

---

## 🔧 API Reference

### useToast()

| Method                        | Parameters       | Description           |
| ----------------------------- | ---------------- | --------------------- |
| `success(message, duration?)` | `string, number` | Show success toast    |
| `error(message, duration?)`   | `string, number` | Show error toast      |
| `warning(message, duration?)` | `string, number` | Show warning toast    |
| `info(message, duration?)`    | `string, number` | Show info toast       |
| `add(options)`                | `object`         | Add custom toast      |
| `remove(id)`                  | `number`         | Remove specific toast |
| `clear()`                     | -                | Remove all toasts     |

### useConfirm()

| Method          | Parameters | Description              |
| --------------- | ---------- | ------------------------ |
| `show(options)` | `object`   | Show confirmation dialog |
| `confirm()`     | -          | Confirm action           |
| `cancel()`      | -          | Cancel action            |
| `close()`       | -          | Close dialog             |

### Confirm Options

```javascript
{
  title: string,              // Dialog title
  message: string,            // Dialog message
  confirmText: string,        // Confirm button label (default: 'Confirm')
  cancelText: string,         // Cancel button label (default: 'Cancel')
  type: 'warning'|'danger'|'info',  // Icon type (default: 'warning')
  onConfirm: async function,  // Callback when confirmed
  onCancel: function          // Callback when cancelled
}
```

---

## 💡 Best Practices

### 1. Toast Notifications

- ✅ Use success for confirmations
- ✅ Use error for failures
- ✅ Keep messages short and clear
- ✅ Don't show more than 3 toasts at once
- ❌ Don't use for navigation
- ❌ Don't use for validation errors (use field-level feedback)

### 2. Confirmation Dialogs

- ✅ Use for destructive actions (delete, archive)
- ✅ Be clear about the consequences
- ✅ Use "danger" type for destructive actions
- ✅ Show confirmation after completion
- ❌ Don't overuse confirmations
- ❌ Don't use for normal operations

### 3. Loading Spinners

- ✅ Show when fetching data
- ✅ Show when processing
- ✅ Use appropriate size and color
- ✅ Combine with toast for completion feedback
- ❌ Don't show indefinitely
- ❌ Don't hide errors with spinners

### Combined Pattern

```javascript
// Good: Show spinner → Action → Toast result
const handleCreate = async () => {
  try {
    isLoading.value = true
    await createSkill(data)
    success('Skill created!') // Toast for feedback
  } catch (err) {
    error('Failed to create skill')
  } finally {
    isLoading.value = false
  }
}

// Better: Show spinner → Action → Confirmation → Toast
const handleDelete = async (id) => {
  show({
    title: 'Delete?',
    onConfirm: async () => {
      try {
        await deleteSkill(id)
        success('Deleted!')
      } catch (err) {
        error('Failed to delete')
      }
    },
  })
}
```

---

## ⚙️ Configuration

### Toast Defaults

Currently using default durations:

- Success: 3 seconds
- Error: 5 seconds
- Warning: 4 seconds
- Info: 3 seconds

To customize, edit `src/composables/useToast.js` durations.

### Styling

All components use Bootstrap classes for consistency. Customize colors in component `<style>` blocks.

---

## 🐛 Troubleshooting

### ToastContainer not showing?

1. Verify `ToastContainer` is in `App.vue`
2. Check z-index (currently 9999)
3. Ensure `useToast()` is imported in component

### ConfirmDialog not showing?

1. Verify `ConfirmDialog` is in `App.vue`
2. Check `useConfirm()` is called correctly
3. Ensure `onConfirm` callback is defined

### Spinner animations not smooth?

1. Check browser GPU acceleration
2. Verify CSS animations are not disabled
3. Check for transform conflicts in parent elements

---

## 🎨 Component Previews

### Toast Types

- **Success**: Green background, check icon
- **Error**: Red background, exclamation icon
- **Warning**: Yellow background, warning triangle
- **Info**: Blue background, info circle

### Confirm Dialog Types

- **Warning**: Orange icon (default for warnings)
- **Danger**: Red icon (for destructive actions)
- **Info**: Blue icon (for informational)

### Loading Spinner Variants

- All 6 Bootstrap color variants available
- Smooth dot-bounce animation
- Responsive sizing

---

## 📝 Next Steps

After Phase 1, proceed with Phase 2:

- BaseSelect, BaseTextarea, BaseCheckbox
- FormGroup (wrapper with label + error)
- Form validation composables

Then Phase 3:

- **CrudPageTemplate** (biggest time saver!)
- All base UI components
- Advanced features
- All 6 Bootstrap color variants available
- Smooth dot-bounce animation
- Responsive sizing

---

## 📝 Next Steps

After Phase 1, proceed with Phase 2:

- BaseSelect, BaseTextarea, BaseCheckbox
- FormGroup (wrapper with label + error)
- Form validation composables

Then Phase 3:

- **CrudPageTemplate** (biggest time saver!)
- All base UI components
- Advanced features
