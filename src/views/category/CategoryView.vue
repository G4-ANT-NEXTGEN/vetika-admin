<template>
  <div class="categories-management-page">
    <BreadcrumbNav :breadcrumbs="breadcrumbs" />

    <header class="page-top-header">
      <div class="title-group">
        <h1 class="management-title">Categories Management</h1>
      </div>
      <button class="add-new-btn" @click="openCreateModal">
        <i class="bi bi-plus-lg"></i>
        Add New
      </button>
    </header>

    <BaseCard class="table-card-wrapper">
      <BaseTable :columns="columns" :items="paginatedCategories" :is-loading="categoryStore.isLoading"
        @view="handleView" @edit="handleEdit" @delete="handleDelete">
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
      <div v-if="categoryStore.categories?.length > 0" class="pagination-footer">
        <BasePagination v-model:page="currentPage" :per-page="itemsPerPage"
          :total-items="categoryStore.categories?.length || 0" />
      </div>
    </BaseCard>

    <div class="stats-footer-grid">
      <StatCard label="Total Items" :value="categoryStore.categories?.length || 0" icon="bi-layers" iconColor="blue"
        :isLoading="categoryStore.isLoading" />
      <StatCard label="Active" :value="activeCount" icon="bi-check-circle" iconColor="green"
        :isLoading="categoryStore.isLoading" />
      <StatCard label="Recently Added" :value="newlyAddedCount" icon="bi-clock-history" iconColor="yellow"
        :isLoading="categoryStore.isLoading" />
    </div>

    <!-- Modals Section -->
    <BaseModal :show="showFormModal" :title="isEditing ? 'Update Category' : 'Add New Category'"
      :subtitle="isEditing ? 'Update your old entry for categories' : 'Create a new entry for categories'"
      :hasPatternHeader="true" @close="showFormModal = false">
      <div class="form-group">
        <BaseInput v-model="form.name" label="Category Name" placeholder="Enter category name..." required
          :error="errors.name" @blur="validate('name')" />
      </div>

      <div class="form-group">
        <label class="form-label mt-3">Category Image</label>
        <div class="image-upload-wrapper">
          <div v-if="imagePreview" class="image-preview">
            <img :src="imagePreview" alt="Preview" class="preview-image" />
            <button type="button" class="replace-image-btn" @click="triggerFileInput">
              <i class="bi bi-arrow-repeat"></i>
            </button>
            <button type="button" class="remove-image-btn" @click="removeImage">
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <div v-else class="upload-box" @click="triggerFileInput">
            <div class="upload-box-content">
              <i class="bi bi-cloud-upload upload-box-icon"></i>
              <p class="upload-box-text">Click to upload or drag image</p>
              <p class="upload-box-hint">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>
        </div>
        <input ref="fileInput" type="file" accept="image/*" @change="handleImageUpload" style="display: none" />
        <span v-if="imageError" class="input-error">{{ imageError }}</span>
      </div>

      <template #footer>
        <button class="modal-btn cancel" :disabled="categoryStore.isProcessing"
          @click="showFormModal = false">Cancel</button>
        <button class="modal-btn confirm" :disabled="categoryStore.isProcessing" @click="saveCategory">
          <span v-if="categoryStore.isProcessing" class="spinner-border spinner-border-sm me-2"></span>
          {{ isEditing ? 'Update Category' : 'Create Category' }}
        </button>
      </template>
    </BaseModal>

    <BaseModal :show="showDetailsModal" title="Category Details"
      subtitle="View complete information about this category" @close="showDetailsModal = false">
      <template #header-icon>
        <div class="header-icon-box">
          <i class="bi bi-folder-fill"></i>
        </div>
      </template>

      <div class="details-grid">
        <div v-if="selectedItem?.image" class="detail-card full category-image-card">
          <label><i class="bi bi-image"></i> Category Image</label>
          <div class="category-image-container">
            <img :src="selectedItem.image" :alt="selectedItem.name" class="category-detail-image" />
          </div>
        </div>
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
          <label><i class="bi bi-card-text"></i> Category Name</label>
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

    <BaseModal :show="showDeleteModal" title="Delete Category ?" subtitle="This action cannot be undone"
      @close="showDeleteModal = false">
      <template #header-icon>
        <div class="icon-box-danger">
          <i class="bi bi-trash-fill"></i>
        </div>
      </template>

      <div class="confirmation-content">
        <div v-if="selectedItem?.image" class="delete-image-preview">
          <img :src="selectedItem.image" :alt="selectedItem.name" class="delete-category-image" />
        </div>
        <p class="confirm-message">
          Are you sure you want to delete <span class="highlight">"{{ selectedItem?.name }}"</span>?
          This will permanently remove the category and all associated data from the system.
        </p>
        <div class="warning-alert">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <div>
            <strong>Warning:</strong>
            <p>This action is permanent and cannot be reversed. Make sure you have backed up any important information.
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <button class="modal-btn cancel" :disabled="categoryStore.isProcessing"
          @click="showDeleteModal = false">Cancel</button>
        <button class="modal-btn delete-confirm" :disabled="categoryStore.isProcessing" @click="confirmDelete">
          <span v-if="categoryStore.isProcessing" class="spinner-border spinner-border-sm me-2"></span>
          Delete Category
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCategoryStore } from '@/stores/categories'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav.vue'
import BaseTable from '@/components/ui/base/BaseTable.vue'
import BaseCard from '@/components/ui/base/BaseCard.vue'
import StatCard from '@/components/ui/StatCard.vue'
import BaseModal from '@/components/ui/base/BaseModal.vue'
import BasePagination from '@/components/ui/base/BasePagination.vue'
import BaseInput from '@/components/ui/base/BaseInput.vue'
import { useFormValidation, validationRules } from '@/composables/useFormValidation'
import { useToast } from '@/composables/useToast'

// --- State ---
const categoryStore = useCategoryStore()
const route = useRoute()
const toast = useToast()
const showFormModal = ref(false)
const showDetailsModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const selectedItem = ref(null)

// --- Pagination State ---
const currentPage = ref(1)
const itemsPerPage = ref(10)

const form = reactive({
  name: '',
  image: null
})

const imagePreview = ref(null)
const fileInput = ref(null)
const imageError = ref('')
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

const { errors, validateField: validate, validate: validateAll, reset: resetValidation } = useFormValidation(form, {
  name: [
    validationRules.required('Category name is required'),
    validationRules.maxLength(255, 'Category name must be under 255 characters')
  ]
})

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// --- Breadcrumbs ---
const breadcrumbs = [
  { label: 'Home', path: '/', icon: 'house' },
  { label: 'Settings', path: null },
  { label: 'Categories', path: '/category' }
]

// --- Table Config ---
const columns = [
  { key: 'id', label: 'ID', width: '100px' },
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status', width: '150px' },
  { key: 'created_at', label: 'Created', width: '180px' },
]

onMounted(async () => {
  await categoryStore.fetchCategories()

  // Open create modal if redirected from dashboard quick actions
  if (route.query.action === 'create') {
    openCreateModal()
  }
})

// --- Computeds ---
const activeCount = computed(() => (categoryStore.categories || []).filter(s => !s.status || s.status === 'Active').length)

const newlyAddedCount = computed(() => {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  return (categoryStore.categories || []).filter(s => new Date(s.created_at || Date.now()) > sevenDaysAgo).length
})

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return (categoryStore.categories || []).slice(start, end)
})

// Reset pagination when data changes
watch(() => categoryStore.categories?.length, () => {
  currentPage.value = 1
})

// --- Handlers ---
const openCreateModal = () => {
  isEditing.value = false
  form.name = ''
  form.image = null
  imagePreview.value = null
  imageError.value = ''
  resetValidation()
  showFormModal.value = true
}

const handleEdit = (item) => {
  isEditing.value = true
  selectedItem.value = item
  form.name = item.name
  form.image = null
  imagePreview.value = item.image || null
  imageError.value = ''
  resetValidation()
  showFormModal.value = true
}

const handleImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    imageError.value = ''
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Image must be a JPG, PNG, GIF, or WebP file')
      event.target.value = ''
      form.image = null
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error('Image must be 5MB or smaller')
      event.target.value = ''
      form.image = null
      return
    }
    form.image = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  form.image = null
  imagePreview.value = null
  imageError.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleDelete = (item) => {
  selectedItem.value = item
  showDeleteModal.value = true
}

const handleView = (item) => {
  selectedItem.value = item
  showDetailsModal.value = true
}

const saveCategory = async () => {
  if (!validateAll()) return
  if (!(form.image instanceof File) && !imagePreview.value) {
    imageError.value = 'Category image is required'
    return
  }

  const payload = {
    name: form.name,
  }

  // Only add image if it's a new file (not from edit)
  if (form.image instanceof File) {
    payload.image = form.image
  }

  try {
    if (isEditing.value) {
      const res = await categoryStore.editCategory(selectedItem.value.id, payload)
      toast.success(res?.message || 'Category updated successfully')
    } else {
      const res = await categoryStore.createCategory(payload)
      toast.success(res?.message || 'Category created successfully')
    }
    showFormModal.value = false
    await categoryStore.fetchCategories({ force: true })
  } catch (err) {
    toast.error(isEditing.value ? 'Failed to update category' : 'Failed to create category')
  }
}

const confirmDelete = async () => {
  try {
    const res = await categoryStore.deleteCategory(selectedItem.value.id)
    toast.success(res?.message || 'Category deleted successfully')
    showDeleteModal.value = false
    await categoryStore.fetchCategories({ force: true })
  } catch (err) {
    toast.error('Failed to delete category')
  }
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
.categories-management-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-group {
  display: flex;
  align-items: center;
}

.management-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.2;
}

.add-new-btn {
  background: #fff;
  color: #000;
  border: 1px solid var(--color-border);
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

[data-theme='dark'] .add-new-btn {
  background: var(--nav-surface);
  color: #fff;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
}

.status-active {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-pending {
  background: rgba(234, 179, 8, 0.1);
  color: #eab308;
}

.stats-footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.pagination-footer {
  padding: 20px;
  border-top: 1px solid var(--color-border);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-error {
  color: #ef4444;
  font-size: 12px;
  font-weight: 600;
}

.modal-btn {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.modal-btn.cancel {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.modal-btn.confirm,
.modal-btn.delete-confirm {
  background: var(--color-text);
  color: var(--color-secondary);
}

.modal-btn.full-btn {
  background: var(--color-text);
  color: var(--color-secondary);
  width: 100%;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.detail-card {
  background: var(--nav-surface);
  border: 1px solid var(--color-border);
  padding: 16px;
  border-radius: 12px;
}

.detail-card.full {
  grid-column: span 2;
}

.detail-card label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-muted);
  margin-bottom: 8px;
}

.detail-card p {
  margin: 0;
  font-weight: 700;
  color: var(--color-text);
}

.detail-card .large-text {
  font-size: 18px;
}

.header-icon-box {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
}

.icon-box-danger {
  width: 48px;
  height: 48px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.confirm-message {
  color: var(--color-text);
  margin: 10px 0 20px 0;
  line-height: 1.6;
}

.confirm-message .highlight {
  font-weight: 700;
  color: var(--color-text);
}

.warning-alert {
  background: rgba(234, 179, 8, 0.05);
  border: 1px solid rgba(234, 179, 8, 0.2);
  padding: 16px;
  border-radius: 12px;
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.warning-alert i {
  color: #eab308;
  font-size: 20px;
}

.warning-alert p {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: var(--color-muted);
  line-height: 1.4;
}

@media (max-width: 768px) {
  .stats-footer-grid {
    grid-template-columns: 1fr;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .detail-card.full {
    grid-column: auto;
  }
}

.image-upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.upload-box {
  border: 2px dashed var(--color-border);
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--nav-surface);
}

.upload-box:hover {
  border-color: var(--color-text);
  background: rgba(0, 0, 0, 0.05);
}

[data-theme='dark'] .upload-box:hover {
  background: rgba(255, 255, 255, 0.05);
}

.upload-box-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-box-icon {
  font-size: 32px;
  color: var(--color-muted);
}

.upload-box-text {
  margin: 0;
  color: var(--color-text);
  font-weight: 500;
}

.upload-box-hint {
  margin: 0;
  color: var(--color-muted);
  font-size: 12px;
}

#imageUploadInput,
input[type="file"] {
  display: none;
}

.image-preview {
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: var(--nav-surface);
  border: 1px solid var(--color-border);
}

.preview-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.replace-image-btn {
  position: absolute;
  top: 8px;
  right: 48px;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(59, 130, 246, 0.9);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background 0.3s ease;
}

.replace-image-btn:hover {
  background: #3b82f6;
}

.remove-image-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(239, 68, 68, 0.9);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: background 0.3s ease;
}

.remove-image-btn:hover {
  background: #ef4444;
}

.category-image-card {
  padding: 20px;
}

.category-image-container {
  margin-top: 12px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-background);
  border: 1px solid var(--color-border);
}

.category-detail-image {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  display: block;
}

.delete-image-preview {
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--nav-surface);
}

.delete-category-image {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  display: block;
}
</style>
