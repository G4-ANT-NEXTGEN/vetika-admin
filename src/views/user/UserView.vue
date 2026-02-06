<template>
  <div class="user-management-page">
    <!-- Page Header -->
    <div class="page-top-header">
      <div>
        <h1 class="management-title">Users Management</h1>
        <p class="management-sub">Manage and view all user profiles</p>
      </div>
      <div class="header-actions">
        <div class="view-toggle">
          <button :class="['toggle-btn', { active: viewMode === 'grid' }]" @click="viewMode = 'grid'">
            <i class="bi bi-grid-3x3-gap"></i> Grid
          </button>
          <button :class="['toggle-btn', { active: viewMode === 'table' }]" @click="viewMode = 'table'">
            <i class="bi bi-table"></i> Table
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="stats-grid">
      <StatCard label="Total Users" :value="userStore.pagination.total" icon="bi-people" iconColor="blue"
        :isLoading="userStore.isLoading" />
      <StatCard label="Active Users" :value="activeUsersCount" icon="bi-person-check" iconColor="green"
        :isLoading="userStore.isLoading" />
      <StatCard label="New This Month" :value="newUsersCount" icon="bi-person-plus" iconColor="yellow"
        :isLoading="userStore.isLoading" />
    </div>

    <!-- Search & Filter Section -->
    <div class="search-section">
      <div class="search-box">
        <i class="bi bi-search"></i>
        <input v-model="searchQuery" type="text" placeholder="Search by name or email..." />
      </div>
    </div>

    <!-- Grid View (Cards) -->
    <div v-if="viewMode === 'grid'" class="users-grid-container">
      <div v-if="userStore.isLoading" class="loading-grid">
        <div v-for="i in 12" :key="i" class="user-card-skeleton">
          <BaseSkeleton width="100%" height="240px" borderRadius="12px" />
        </div>
      </div>

      <div v-else-if="filteredUsers.length === 0" class="no-data">
        <i class="bi bi-inbox"></i>
        <p>No users found</p>
      </div>

      <div v-else class="users-grid">
        <div v-for="user in filteredUsers" :key="user.id" class="user-card">
          <!-- Cover Image -->
          <div class="card-cover">
            <img v-if="getCoverUrl(user.cover)" :src="getCoverUrl(user.cover)" :alt="user.full_name" />
            <div v-else class="cover-placeholder"></div>
            <button class="action-btn view-btn" @click="viewUser(user)" title="View Details">
              <i class="bi bi-eye"></i>
            </button>
          </div>

          <!-- Card Content -->
          <div class="card-body">
            <!-- Avatar -->
            <div class="avatar-section">
              <img :src="getAvatarUrl(user.avatar)" :alt="user.full_name" class="avatar" @error="handleImageError" />
            </div>

            <!-- User Info -->
            <div class="user-info">
              <h3 class="user-name">{{ user.full_name }}</h3>
              <p class="user-email">{{ user.email }}</p>
              <p v-if="user.phone" class="user-phone"><i class="bi bi-telephone"></i> {{ user.phone }}</p>
              <p v-if="user.current_city" class="user-location"><i class="bi bi-geo-alt"></i> {{
                user.current_city }}</p>
            </div>

            <!-- Status Badge -->
            <div class="status-section">
              <span class="status-badge" :class="user.email_verified_at ? 'verified' : 'pending'">
                {{ user.email_verified_at ? 'Verified' : 'Pending' }}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Table View -->
    <div v-else class="table-container">
      <BaseTable :columns="tableColumns" :items="filteredUsers" :isLoading="userStore.isLoading" @view="viewUser">
        <template #column-avatar="{ item }">
          <div class="table-avatar">
            <img :src="getAvatarUrl(item.avatar)" :alt="item.full_name" @error="handleImageError" />
          </div>
        </template>
        <template #column-status="{ item }">
          <span class="status-badge" :class="item.email_verified_at ? 'verified' : 'pending'">
            {{ item.email_verified_at ? 'Verified' : 'Pending' }}
          </span>
        </template>
      </BaseTable>
    </div>

    <!-- Pagination -->
    <div v-if="userStore.pagination.total > (userStore.pagination.perPage || 10)" class="pagination-footer">
      <BasePagination :page="userStore.pagination.currentPage" :perPage="userStore.pagination.perPage || 10"
        :totalItems="userStore.pagination.total || 0" @update:page="changePage" />
    </div>

    <!-- View User Modal -->
    <BaseModal :show="showViewModal" title="User Profile" subtitle="Complete user information" size="xl"
      @close="showViewModal = false">
      <template #header-icon>
        <div class="header-icon-box">
          <i class="bi bi-person-circle"></i>
        </div>
      </template>

      <div v-if="selectedUser" class="user-details">
        <div class="profile-column">
          <div class="detail-header">
            <!-- Avatar -->
            <div class="detail-avatar">
              <img :src="getAvatarUrl(selectedUser.avatar)" :alt="selectedUser.full_name" @error="handleImageError" />
            </div>

            <div class="detail-header-body">
              <!-- Cover Image -->
              <div v-if="getCoverUrl(selectedUser.cover)" class="detail-cover">
                <img :src="getCoverUrl(selectedUser.cover)" :alt="selectedUser.full_name" />
              </div>
              <div class="detail-identity">
                <h3>{{ selectedUser.full_name || 'N/A' }}</h3>
                <p>#{{ selectedUser.id }} · {{ selectedUser.email || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="details-grid">
          <div class="detail-card">
            <label><i class="bi bi-hash"></i> ID</label>
            <p>#{{ selectedUser.id }}</p>
          </div>
          <div class="detail-card">
            <label><i class="bi bi-person"></i> Full Name</label>
            <p>{{ selectedUser.full_name }}</p>
          </div>
          <div class="detail-card">
            <label><i class="bi bi-envelope"></i> Email</label>
            <p>{{ selectedUser.email }}</p>
          </div>
          <div class="detail-card">
            <label><i class="bi bi-telephone"></i> Phone</label>
            <p>{{ selectedUser.phone || 'N/A' }}</p>
          </div>
          <div class="detail-card">
            <label><i class="bi bi-calendar"></i> Date of Birth</label>
            <p>{{ selectedUser.dob ? formatDate(selectedUser.dob) : 'N/A' }}</p>
          </div>
          <div class="detail-card">
            <label><i class="bi bi-gender-ambiguous"></i> Gender</label>
            <p>{{ formatGender(selectedUser.gender) }}</p>
          </div>
          <div class="detail-card">
            <label><i class="bi bi-geo-alt"></i> Current City</label>
            <p>{{ selectedUser.current_city || 'N/A' }}</p>
          </div>
          <div class="detail-card">
            <label><i class="bi bi-house"></i> Hometown</label>
            <p>{{ selectedUser.home_town || 'N/A' }}</p>
          </div>
          <div class="detail-card full">
            <label><i class="bi bi-link-45deg"></i> Portfolio</label>
            <p v-if="selectedUser.portfolio_link">
              <a :href="selectedUser.portfolio_link" target="_blank">{{ selectedUser.portfolio_link }}</a>
            </p>
            <p v-else>N/A</p>
          </div>
          <div v-if="selectedUser.cv" class="detail-card full">
            <label><i class="bi bi-file-pdf"></i> CV</label>
            <a :href="`${API_BASE_URL}/storage/${selectedUser.cv}`" target="_blank" class="download-link">
              Download CV
            </a>
          </div>
          <div class="detail-card">
            <label><i class="bi bi-check-circle"></i> Email Status</label>
            <span class="status-badge" :class="selectedUser.email_verified_at ? 'verified' : 'pending'">
              {{ selectedUser.email_verified_at ? 'Verified' : 'Pending' }}
            </span>
          </div>
          <div class="detail-card">
            <label><i class="bi bi-calendar-event"></i> Created Date</label>
            <p>{{ formatDate(selectedUser.created_at) }}</p>
          </div>
        </div>
      </div>

      <template #footer>
        <button class="modal-btn cancel" @click="showViewModal = false">Close</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/users'
import BaseTable from '@/components/ui/base/BaseTable.vue'
import BasePagination from '@/components/ui/base/BasePagination.vue'
import BaseModal from '@/components/ui/base/BaseModal.vue'
import BaseSkeleton from '@/components/ui/base/BaseSkeleton.vue'
import StatCard from '@/components/ui/StatCard.vue'

const userStore = useUserStore()
const viewMode = ref('grid')
const searchQuery = ref('')
const showViewModal = ref(false)
const selectedUser = ref(null)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://novia2.csm.linkpc.net'

const getAvatarUrl = (avatar) => {
  if (!avatar || avatar === 'no_photo.jpg') {
    return '/images/avatar/avatar-illustrated-01.png'
  }
  return `${API_BASE_URL}/storage/avatars/${avatar}`
}

const getCoverUrl = (cover) => {
  if (!cover || cover === 'no_photo.jpg') {
    return null
  }
  return `${API_BASE_URL}/storage/covers/${cover}`
}

const tableColumns = [
  { key: 'avatar', label: 'Avatar', width: '80px' },
  { key: 'full_name', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone', width: '150px' },
  { key: 'status', label: 'Status', width: '120px' },
]

onMounted(async () => {
  console.log('UserView mounted, fetching users...')
  try {
    await userStore.fetchUsers(1)
    console.log('Users fetched successfully:', userStore.users.length)
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
})

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) return userStore.users

  const query = searchQuery.value.toLowerCase()
  return userStore.users.filter(user =>
    user.full_name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    (user.phone && user.phone.includes(query))
  )
})

const activeUsersCount = computed(() => {
  return userStore.users.filter(u => u.email_verified_at).length
})

const newUsersCount = computed(() => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return userStore.users.filter(u => new Date(u.created_at) > thirtyDaysAgo).length
})

const viewUser = (user) => {
  selectedUser.value = user
  showViewModal.value = true
}

const changePage = (page) => {
  userStore.fetchUsers(page)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatGender = (gender) => {
  if (!gender) return 'N/A'
  return gender === 1 ? 'Male' : gender === 2 ? 'Female' : 'Other'
}

const handleImageError = (e) => {
  e.target.src = '/images/avatar/avatar-illustrated-01.png'
}
</script>

<style scoped>
.user-management-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-top-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
}

.management-title,
.management-sub {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.2;
}

.management-sub {
  font-size: 14px;
  font-weight: 400;
  color: var(--color-muted);
}

.header-actions {
  display: flex;
  gap: 12px;
}

.view-toggle {
  display: flex;
  gap: 8px;
  background: var(--nav-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 4px;
}

.toggle-btn {
  padding: 8px 14px;
  border: none;
  background: transparent;
  color: var(--color-muted);
  cursor: pointer;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  background: var(--color-text);
  color: var(--color-secondary);
}

.toggle-btn:hover {
  color: var(--color-text);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.search-section {
  display: flex;
  gap: 12px;
}

.search-box {
  flex: 1;
  max-width: 400px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  background: var(--nav-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-muted);
}

.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  color: var(--color-text);
  padding: 12px 0;
  font-size: 14px;
}

.search-box input::placeholder {
  color: var(--color-muted);
}

/* Grid View */
.users-grid-container {
  width: 100%;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.user-card-skeleton {
  height: 340px;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.user-card {
  background: var(--nav-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.user-card:hover {
  border-color: var(--color-text);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-cover {
  position: relative;
  height: 120px;
  background: linear-gradient(135deg, rgba(74, 74, 74, 0.6), rgba(90, 90, 90, 0.6));
  overflow: hidden;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4a4a4a, #5a5a5a);
}

.action-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.3s ease;
  opacity: 0;
}

.user-card:hover .action-btn {
  opacity: 1;
}

.action-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.card-body {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.avatar-section {
  display: flex;
  justify-content: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid var(--color-border);
  object-fit: cover;
  margin-top: -50px;
  background: var(--color-background);
}

.user-info {
  text-align: center;
}

.user-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
}

.user-email,
.user-phone,
.user-location {
  margin: 4px 0;
  font-size: 12px;
  color: var(--color-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.status-section {
  display: flex;
  justify-content: center;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

.status-badge.verified {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-badge.pending {
  background: rgba(234, 179, 8, 0.1);
  color: #eab308;
}


:deep(.table-container .action-btn.edit),
:deep(.table-container .action-btn.delete) {
  display: none;
}

/* Table View */
.table-container {
  background: var(--nav-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
}

.loading-table {
  padding: 40px;
  text-align: center;
  color: var(--color-muted);
}

.table-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.table-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.action-icon:hover {
  background: var(--color-border);
}

.action-icon.delete:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* Pagination */
.pagination-footer {
  display: flex;
  justify-content: center;
  padding: 20px;
  border-top: 1px solid var(--color-border);
}

/* Modal Styles */
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


.user-details {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 16px;
  align-items: start;
}

.profile-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-header-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-cover {
  width: 100%;
  height: 130px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #4a4a4a, #5a5a5a);
}

.detail-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-avatar {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.detail-avatar img {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 4px solid var(--nav-surface);
  object-fit: cover;
}

.detail-identity {
  background: var(--nav-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 10px 12px;
}

.detail-identity h3 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
}

.detail-identity p {
  margin: 0;
  font-size: 12px;
  color: var(--color-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}

.detail-card {
  background: var(--nav-surface);
  border: 1px solid var(--color-border);
  padding: 12px;
  border-radius: 10px;
}

.detail-card.full {
  grid-column: span 2;
}

.detail-card label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-muted);
  margin-bottom: 6px;
}

.detail-card p {
  margin: 0;
  font-weight: 600;
  color: var(--color-text);
}

.download-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.download-link:hover {
  color: #2563eb;
  text-decoration: underline;
}


.modal-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 13px;
  transition: all 0.3s ease;
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

.modal-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 20px;
  color: var(--color-muted);
}

.no-data i {
  font-size: 48px;
  opacity: 0.5;
}

@media (max-width: 768px) {
  .page-top-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .users-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .detail-card.full {
    grid-column: span 1;
  }

  .user-details {
    grid-template-columns: 1fr;
  }

  .detail-identity p {
    white-space: normal;
  }
}
</style>
