<template>
  <div class="skills-management-page">
    <BreadcrumbNav :breadcrumbs="breadcrumbs" />

    <header class="page-top-header">
      <div class="title-group">
        <h1 class="management-title">Skills</h1>
        <p class="management-sub">Management</p>
      </div>
      <button class="add-new-btn" @click="openCreateModal">
        <i class="bi bi-plus-lg"></i>
        Add New
      </button>
    </header>

    <div class="action-bar-container">
      <BaseSearch
        v-model="searchQuery"
        placeholder="Search skills..."
        @search="handleSearch"
      />
    </div>

    <BaseCard class="table-card-wrapper">
      <BaseTable
        :columns="columns"
        :items="paginatedSkills"
        :is-loading="skillStore.isLoading"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
      >
        <template #column-id="{ item }">
          <span class="id-text">#{{ item.id }}</span>
        </template>
        <template #column-name="{ item }">
          <span class="fw-semibold">{{ item.name }}</span>
        </template>
        <template #column-status="{ item }">
          <span class="status-badge" :class="getStatusClass(item.status)">
            {{ item.status || 'Active' }}
          </span>
        </template>
        <template #column-created_at="{ item }">
          <span class="date-text">{{ formatDate(item.created_at) }}</span>
        </template>
      </BaseTable>

      <!-- Pagination -->
      <div v-if="skillStore.skills?.length > 0" class="pagination-footer">
        <BasePagination
          v-model:page="currentPage"
          :per-page="itemsPerPage"
          :total-items="skillStore.skills?.length || 0"
        />
      </div>
    </BaseCard>

    <div class="stats-footer-grid">
      <StatCard label="Total Items" :value="skillStore.skills?.length || 0" icon="bi-layers" iconColor="blue" :isLoading="skillStore.isLoading" />
      <StatCard label="Active" :value="activeCount" icon="bi-check-circle" iconColor="green" :isLoading="skillStore.isLoading" />
      <StatCard label="Recently Added" :value="newlyAddedCount" icon="bi-clock-history" iconColor="yellow" :isLoading="skillStore.isLoading" />
    </div>

    <!-- Modals Section -->
    <BaseModal
      :show="showFormModal"
      :title="isEditing ? 'Update skill' : 'Add New Skill'"
      :subtitle="isEditing ? 'Update your old entry for skills' : 'Create a new entry for skills'"
      :hasPatternHeader="true"
      @close="showFormModal = false"
    >
      <div class="form-group">
        <BaseInput
          v-model="form.name"
          label="Skill Name"
          placeholder="Enter skill name..."
          required
          :error="errors.name"
          @blur="validate('name')"
        />
      </div>
      <template #footer>
        <button class="modal-btn cancel" :disabled="skillStore.isProcessing" @click="showFormModal = false">Cancel</button>
        <button class="modal-btn confirm" :disabled="skillStore.isProcessing" @click="saveSkill">
          <span v-if="skillStore.isProcessing" class="spinner-border spinner-border-sm me-2"></span>
          {{ isEditing ? 'Update skill' : 'Create skill' }}
        </button>
      </template>
    </BaseModal>

    <BaseModal
      :show="showDetailsModal"
      title="Skill Details"
      subtitle="View complete information about this skill"
      @close="showDetailsModal = false"
    >
      <template #header-icon>
        <div class="header-icon-box">
          <i class="bi bi-tag-fill"></i>
        </div>
      </template>

      <div class="details-grid">
        <div class="detail-card">
          <label><i class="bi bi-hash"></i> ID</label>
          <p>#{{ selectedItem?.id }}</p>
        </div>
        <div class="detail-card">
          <label><i class="bi bi-lightning-fill"></i> Status</label>
          <div>
             <span class="status-badge" :class="getStatusClass(selectedItem?.status)">
              {{ selectedItem?.status || 'Active' }}
            </span>
          </div>
        </div>
        <div class="detail-card full">
          <label><i class="bi bi-card-text"></i> Skill Name</label>
          <p class="large-text">{{ selectedItem?.name }}</p>
        </div>
        <div class="detail-card">
          <label><i class="bi bi-calendar-event"></i> Created Date</label>
          <p>{{ formatDate(selectedItem?.created_at) }}</p>
        </div>
        <div class="detail-card">
          <label><i class="bi bi-person-badge"></i> Created By</label>
          <p>Admin</p>
        </div>
      </div>

      <template #footer>
        <button class="modal-btn full-btn" @click="showDetailsModal = false">Close</button>
      </template>
    </BaseModal>

    <BaseModal
      :show="showDeleteModal"
      title="Delete Skill ?"
      subtitle="This action cannot be undone"
      @close="showDeleteModal = false"
    >
      <template #header-icon>
        <div class="icon-box-danger">
          <i class="bi bi-trash-fill"></i>
        </div>
      </template>

      <div class="confirmation-content">
        <p class="confirm-message">
          Are you sure you want to delete <span class="highlight">"{{ selectedItem?.name }}"</span>?
          This will permanently remove the skill and all associated data from the system.
        </p>
        <div class="warning-alert">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <div>
            <strong>Warning:</strong>
            <p>This action is permanent and cannot be reversed. Make sure you have backed up any important information.</p>
          </div>
        </div>
      </div>

      <template #footer>
        <button class="modal-btn cancel" :disabled="skillStore.isProcessing" @click="showDeleteModal = false">Cancel</button>
        <button class="modal-btn delete-confirm" :disabled="skillStore.isProcessing" @click="confirmDelete">
          <span v-if="skillStore.isProcessing" class="spinner-border spinner-border-sm me-2"></span>
          Delete Skill
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSkillStore } from '@/stores/skills'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav.vue'
import BaseSearch from '@/components/ui/BaseSearch.vue'
import BaseTable from '@/components/ui/base/BaseTable.vue'
import BaseCard from '@/components/ui/base/BaseCard.vue'
import StatCard from '@/components/ui/StatCard.vue'
import BaseModal from '@/components/ui/base/BaseModal.vue'
import BasePagination from '@/components/ui/base/BasePagination.vue'
import BaseInput from '@/components/ui/base/BaseInput.vue'
import { useFormValidation, validationRules } from '@/composables/useFormValidation'

// --- State ---
const skillStore = useSkillStore()
const route = useRoute()
const searchQuery = ref('')
const showFormModal = ref(false)
const showDetailsModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const selectedItem = ref(null)

// --- Pagination State ---
const currentPage = ref(1)
const itemsPerPage = ref(10)

const form = reactive({
  name: ''
})

const { errors, validateField: validate, validate: validateAll, reset: resetValidation } = useFormValidation(form, {
  name: [validationRules.required('Skill name is required')]
})

// --- Breadcrumbs ---
const breadcrumbs = [
  { label: 'Home', path: '/', icon: 'house' },
  { label: 'Settings', path: null },
  { label: 'Skills', path: '/skill' }
]

// --- Table Config ---
const columns = [
  { key: 'id', label: 'ID', width: '100px' },
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status', width: '150px' },
  { key: 'created_at', label: 'Created', width: '180px' },
]

onMounted( async () => {
  await skillStore.fetchSkills()

  // Open create modal if redirected from dashboard quick actions
  if (route.query.action === 'create') {
    openCreateModal()
  }
})

// --- Computeds ---
const activeCount = computed(() => (skillStore.skills || []).filter(s => !s.status || s.status === 'Active').length)

const newlyAddedCount = computed(() => {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  return (skillStore.skills || []).filter(s => new Date(s.created_at || Date.now()) > sevenDaysAgo).length
})

const paginatedSkills = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return (skillStore.skills || []).slice(start, end)
})

// Reset pagination when data changes
watch(() => skillStore.skills?.length, () => {
  currentPage.value = 1
})

// --- Handlers ---
const openCreateModal = () => {
  isEditing.value = false
  form.name = ''
  resetValidation()
  showFormModal.value = true
}

const handleEdit = (item) => {
  isEditing.value = true
  selectedItem.value = item
  form.name = item.name
  resetValidation()
  showFormModal.value = true
}

const handleDelete = (item) => {
  selectedItem.value = item
  showDeleteModal.value = true
}

const handleView = (item) => {
  selectedItem.value = item
  showDetailsModal.value = true
}

const saveSkill = async () => {
  if (!validateAll()) return

  if (isEditing.value) {
    await skillStore.editSkill(selectedItem.value.id, { name: form.name })
  } else {
    await skillStore.createSkill({ name: form.name })
  }
  showFormModal.value = false
  await skillStore.fetchSkills({ force: true })
}

const confirmDelete = async () => {
  await skillStore.deleteSkill(selectedItem.value.id)
  showDeleteModal.value = false
  await skillStore.fetchSkills({ force: true })
}

const handleSearch = () => {
  console.log('Searching:', searchQuery.value)
}

const formatDate = (date) => {
  if (!date) return 'Jan 15, 2026'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getStatusClass = (status) => {
  if (!status || status === 'Active') return 'status-active'
  if (status === 'Pending') return 'status-pending'
  return ''
}
</script>

<style scoped>
.skills-management-page { display: flex; flex-direction: column; gap: 24px; }

.page-top-header { display: flex; justify-content: space-between; align-items: flex-end; }
.management-title, .management-sub { margin: 0; font-size: 20px; font-weight: 600; color: var(--color-text); line-height: 1.2; }

.add-new-btn {
  background: #fff; color: #000; border: 1px solid var(--color-border); padding: 8px 16px;
  border-radius: 8px; font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 8px; cursor: pointer;
}
[data-theme='dark'] .add-new-btn { background: var(--nav-surface); color: #fff; }

.status-badge { padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; }
.status-active { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
.status-pending { background: rgba(234, 179, 8, 0.1); color: #eab308; }

.stats-footer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

.pagination-footer {
  padding: 20px;
  border-top: 1px solid var(--color-border);
}

.form-group { display: flex; flex-direction: column; gap: 10px; }

.modal-btn { flex: 1; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; border: none; }
.modal-btn.cancel { background: transparent; border: 1px solid var(--color-border); color: var(--color-text); }
.modal-btn.confirm, .modal-btn.delete-confirm { background: var(--color-text); color: var(--color-secondary); }
.modal-btn.full-btn { background: var(--color-text); color: var(--color-secondary); width: 100%; }

.details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.detail-card { background: var(--nav-surface); border: 1px solid var(--color-border); padding: 16px; border-radius: 12px; }
.detail-card.full { grid-column: span 2; }
.detail-card label { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--color-muted); margin-bottom: 8px; }
.detail-card p { margin: 0; font-weight: 700; color: var(--color-text); }
.detail-card .large-text { font-size: 18px; }

.header-icon-box {
  width: 40px; height: 40px; background: rgba(255,255,255,0.05); border: 1px solid var(--color-border);
  border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--color-text);
}

.icon-box-danger {
  width: 48px; height: 48px; background: rgba(239, 68, 68, 0.1); color: #ef4444;
  border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px;
}

.confirm-message { color: var(--color-text); margin: 10px 0 20px 0; line-height: 1.6; }
.confirm-message .highlight { font-weight: 700; color: var(--color-text); }

.warning-alert {
  background: rgba(234, 179, 8, 0.05); border: 1px solid rgba(234, 179, 8, 0.2);
  padding: 16px; border-radius: 12px; display: flex; gap: 15px; align-items: flex-start;
}
.warning-alert i { color: #eab308; font-size: 20px; }
.warning-alert p { margin: 4px 0 0 0; font-size: 12px; color: var(--color-muted); line-height: 1.4; }

@media (max-width: 768px) { .stats-footer-grid { grid-template-columns: 1fr; } .details-grid { grid-template-columns: 1fr; } .detail-card.full { grid-column: auto; } }
</style>
