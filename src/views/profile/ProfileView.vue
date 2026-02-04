<template>
  <div class="profile-page">
    <BreadcrumbNav :breadcrumbs="breadcrumbs" />

    <!-- Profile Header / Hero Section -->
    <BaseCard class="profile-hero-card" :no-padding="true">
      <div class="hero-cover">
        <div class="topographic-pattern"></div>
      </div>
      <div v-if="profileStore.isLoading" class="hero-content">
        <div class="profile-identity">
          <div class="profile-avatar-wrapper">
            <BaseSkeleton type="circle" width="120px" height="120px" />
          </div>
          <div class="identity-text">
            <BaseSkeleton width="220px" height="32px" borderRadius="10px" class="mb-3" />
            <div class="user-meta">
              <BaseSkeleton width="120px" height="24px" borderRadius="20px" />
              <BaseSkeleton width="160px" height="24px" borderRadius="10px" />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="hero-content">
        <div class="profile-identity">
          <div class="profile-avatar-wrapper">
            <div class="profile-avatar" @click="triggerUpload" :class="{ 'uploading': profileStore.isProcessing }">
              <span v-if="!profileStore.user?.avatar">NG</span>
              <img v-else :src="profileStore.user.avatar" alt="Profile" />

              <div class="avatar-overlay">
                <i class="bi bi-camera-fill"></i>
              </div>

              <div v-if="profileStore.isProcessing" class="avatar-spinner">
                <div class="spinner-border spinner-border-sm text-light"></div>
              </div>
            </div>
            <div class="status-indicator active"></div>

            <button v-if="profileStore.user?.avatar" class="remove-avatar-btn" @click.stop="removeAvatar"
              title="Remove Photo">
              <i class="bi bi-x"></i>
            </button>
            <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none" accept="image/*" />
          </div>
          <div class="identity-text">
            <h2 class="user-name">{{ profileStore.user?.full_name || 'Naya Rachel' }}</h2>
            <div class="user-meta">
              <span v-for="role in profileStore.user?.roles" :key="role.id" class="role-badge">{{ role.name }}</span>
              <div class="meta-item">
                <i class="bi bi-calendar-check"></i>
                Joined {{ formatDate(profileStore.user?.created_at) }}
              </div>
              <div class="meta-item status-active">
                <i class="bi bi-lightning-fill"></i>
                Active 2 minutes ago
              </div>
            </div>
          </div>
        </div>
        <button class="edit-profile-btn" @click="openEditModal">
          <i class="bi bi-pencil-square"></i>
          Edit Profile
        </button>
      </div>
    </BaseCard>

    <!-- Edit Personal Info Modal -->
    <BaseModal :show="showEditModal" title="Edit Personal Information" subtitle="Update your basic account details"
      @close="showEditModal = false">
      <template #header-icon>
        <div class="header-icon-box">
          <i class="bi bi-person-gear"></i>
        </div>
      </template>

      <div class="edit-grid">
        <BaseInput v-model="personalForm.full_name" label="Full Name" type="text" placeholder="Enter full name"
          :error="personalFormErrors.full_name" @blur="validatePersonalField('full_name')" />

        <BaseInput v-model="personalForm.email" label="Email Address" type="email" placeholder="Enter email"
          :error="personalFormErrors.email" @blur="validatePersonalField('email')" />

        <BaseInput v-model="personalForm.phone" label="Phone Number" type="text" placeholder="Enter phone number"
          :error="personalFormErrors.phone" @blur="validatePersonalField('phone')" />

        <BaseInput v-model="personalForm.dob" label="Date of Birth" type="date" :error="personalFormErrors.dob"
          @blur="validatePersonalField('dob')" />

        <BaseSelect v-model="personalForm.gender" label="Gender" :options="[
          { value: 0, label: 'Female' },
          { value: 1, label: 'Male' },
          { value: 2, label: 'Other' }
        ]" :error="personalFormErrors.gender" @blur="validatePersonalField('gender')" />

        <BaseInput v-model="personalForm.current_city" label="Current City" type="text" placeholder="Enter city"
          :error="personalFormErrors.current_city" @blur="validatePersonalField('current_city')" />

        <BaseInput v-model="personalForm.home_town" label="Home Town" type="text" placeholder="Enter home town"
          :error="personalFormErrors.home_town" @blur="validatePersonalField('home_town')" />

        <BaseInput v-model="personalForm.portfolio_link" label="Portfolio Link" type="url" placeholder="https://..."
          :error="personalFormErrors.portfolio_link" @blur="validatePersonalField('portfolio_link')"
          class="full-width-input" />
      </div>

      <template #footer>
        <button class="modal-btn cancel" @click="showEditModal = false">Cancel</button>
        <button class="modal-btn confirm" :disabled="profileStore.isProcessing" @click="savePersonalInfo">
          <span v-if="profileStore.isProcessing" class="spinner-border spinner-border-sm me-2"></span>
          {{ profileStore.isProcessing ? 'Saving...' : 'Save Changes' }}
        </button>
      </template>
    </BaseModal>

    <!-- Main Content with Tabs -->
    <div class="profile-main-layout">
      <div class="main-column">
        <!-- Tabs Navigation -->
        <div class="profile-tabs">
          <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id">
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab Content: Overview -->
        <div v-if="activeTab === 'overview'" class="tab-pane fade-in">
          <BaseCard class="info-section">
            <div class="section-header">
              <div class="icon-box">
                <i class="bi bi-person-fill"></i>
              </div>
              <div class="section-title">
                <h3>Personal Information</h3>
                <p>Update your personal details</p>
              </div>
            </div>

            <template v-if="profileStore.isLoading">
              <div class="info-grid">
                <div v-for="i in 8" :key="i" class="form-group" :class="{ 'full-width': i >= 8 }">
                  <BaseSkeleton width="120px" height="14px" class="mb-2" />
                  <BaseSkeleton width="100%" height="48px" borderRadius="10px" />
                </div>
              </div>
            </template>
            <template v-else>
              <div class="info-grid">
                <div class="form-group">
                  <label><i class="bi bi-person"></i> Full Name</label>
                  <div class="static-input">{{ profileStore.user?.full_name || 'Naya Rachel' }}</div>
                </div>
                <div class="form-group">
                  <label><i class="bi bi-envelope"></i> Email Address</label>
                  <div class="static-input">{{ profileStore.user?.email || 'admin@ngadmin.com' }}</div>
                </div>
                <div class="form-group">
                  <label><i class="bi bi-telephone"></i> Phone Number</label>
                  <div class="static-input">{{ profileStore.user?.phone || '+1 (555) 123-4567' }}</div>
                </div>
                <div class="form-group">
                  <label><i class="bi bi-geo-alt"></i> Current City</label>
                  <div class="static-input">{{ profileStore.user?.current_city || 'San Francisco, CA' }}</div>
                </div>
                <div class="form-group">
                  <label><i class="bi bi-house-door"></i> Home Town</label>
                  <div class="static-input">{{ profileStore.user?.home_town || '-' }}</div>
                </div>
                <div class="form-group">
                  <label><i class="bi bi-calendar-event"></i> Date of Birth</label>
                  <div class="static-input">{{ formatDate(profileStore.user?.dob) }}</div>
                </div>
                <div class="form-group">
                  <label><i class="bi bi-gender-ambiguous"></i> Gender</label>
                  <div class="static-input">{{ getGenderLabel(profileStore.user?.gender) }}</div>
                </div>
                <div class="form-group full-width">
                  <label><i class="bi bi-link-45deg"></i> Portfolio</label>
                  <div class="static-input">
                    <a v-if="profileStore.user?.portfolio_link" :href="profileStore.user.portfolio_link" target="_blank"
                      class="text-link">
                      {{ profileStore.user.portfolio_link }}
                    </a>
                    <span v-else>-</span>
                  </div>
                </div>
              </div>
            </template>
          </BaseCard>

          <BaseCard class="info-section mt-4">
            <div class="section-header">
              <div class="icon-box">
                <i class="bi bi-shield-check"></i>
              </div>
              <div class="section-title">
                <h3>Professional Information</h3>
                <p>Your role and department details</p>
              </div>
            </div>

            <template v-if="profileStore.isLoading">
              <div class="info-grid">
                <div v-for="i in 2" :key="i" class="form-group">
                  <BaseSkeleton width="80px" height="14px" class="mb-2" />
                  <BaseSkeleton width="100%" height="48px" borderRadius="10px" />
                </div>
              </div>
            </template>
            <template v-else>
              <div class="info-grid">
                <div class="form-group">
                  <label>Role</label>
                  <div class="static-input">{{ profileStore.user?.roles?.[0]?.name || 'System Administrator' }}</div>
                </div>
                <div class="form-group">
                  <label>Department</label>
                  <div class="static-input">IT Administration</div>
                </div>
              </div>
            </template>
          </BaseCard>
        </div>

        <!-- Tab Content: Security -->
        <div v-if="activeTab === 'security'" class="tab-pane fade-in">
          <BaseCard class="info-section">
            <div class="section-header">
              <div class="icon-box">
                <i class="bi bi-key-fill"></i>
              </div>
              <div class="section-title">
                <h3>Password</h3>
                <p>Change your password</p>
              </div>
            </div>

            <form class="security-form" @submit.prevent="updatePassword">
              <!-- Hidden username field for accessibility and password managers -->
              <input type="email" :value="profileStore.user?.email" autocomplete="username" name="username"
                style="display: none;" readonly>
              <BaseInput v-model="passwordForm.old_pass" label="Current Password" type="password"
                placeholder="Enter current password" :error="passwordFormErrors.old_pass"
                @blur="validatePasswordField('old_pass')" autocomplete="current-password" name="current-password"
                class="mb-4" />

              <BaseInput v-model="passwordForm.new_pass" label="New Password" type="password"
                placeholder="Enter new password" :error="passwordFormErrors.new_pass"
                @blur="validatePasswordField('new_pass')" autocomplete="new-password" name="new-password"
                class="mb-4" />

              <BaseInput v-model="passwordForm.new_pass_confirmation" label="Confirm New Password" type="password"
                placeholder="Confirm new password" :error="passwordFormErrors.new_pass_confirmation"
                @blur="validatePasswordField('new_pass_confirmation')" autocomplete="new-password"
                name="confirm-password" class="mb-4" />

              <button type="submit" class="modal-btn confirm btn-update" :disabled="profileStore.isProcessing">
                <span v-if="profileStore.isProcessing" class="spinner-border spinner-border-sm me-2"></span>
                Update Password
              </button>
            </form>
          </BaseCard>

        </div>

      </div>

      <aside class="side-column">
        <BaseCard class="sidebar-info-card">
          <h4 class="sidebar-title">Account Status</h4>
          <div class="status-list">
            <div class="status-item">
              <div class="status-icon green">
                <i class="bi bi-check-circle"></i>
              </div>
              <div class="status-text">
                <span class="lbl">Verified</span>
                <span class="val">{{ profileStore.user?.email_verified_at ? 'Yes' : 'No' }}</span>
              </div>
            </div>
            <div class="status-item">
              <div class="status-icon blue">
                <i class="bi bi-shield-check"></i>
              </div>
              <div class="status-text">
                <span class="lbl">Role</span>
                <span class="val">{{ profileStore.user?.roles?.[0]?.name || 'Administrator' }}</span>
              </div>
            </div>
            <div class="status-item">
              <div class="status-icon purple">
                <i class="bi bi-calendar-event"></i>
              </div>
              <div class="status-text">
                <span class="lbl">Created</span>
                <span class="val">{{ formatDate(profileStore.user?.created_at) }}</span>
              </div>
            </div>
            <div class="status-item">
              <div class="status-icon blue">
                <i class="bi bi-box-arrow-in-right"></i>
              </div>
              <div class="status-text">
                <span class="lbl">Last Login</span>
                <span class="val">{{ formatCompactDate(profileStore.user?.last_login_at) }}</span>
              </div>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="sidebar-info-card">
          <h4 class="sidebar-title">Profile Completeness</h4>
          <div class="completion-meter">
            <div class="completion-bar" :style="{ width: profileCompletion + '%' }"></div>
          </div>
          <div class="completion-meta">{{ profileCompletion }}% complete</div>
          <div class="chip-list">
            <span v-for="field in missingFields" :key="field" class="chip">Missing {{ field }}</span>
            <span v-if="!missingFields.length" class="chip success">All set</span>
          </div>
        </BaseCard>

        <BaseCard class="sidebar-info-card">
          <h4 class="sidebar-title">Recent Updates</h4>
          <div class="activity-mini-list">
            <div v-for="(item, index) in recentUpdates" :key="index" class="activity-mini-item">
              <div class="act-icon blue">
                <i class="bi bi-arrow-repeat"></i>
              </div>
              <div class="act-content">
                <span class="act-title">{{ item.title }}</span>
                <span class="act-time">{{ item.time }}</span>
              </div>
            </div>
            <div v-if="!recentUpdates.length" class="empty-state">No recent updates</div>
          </div>
        </BaseCard>

        <BaseCard class="sidebar-info-card">
          <h4 class="sidebar-title">Connected Data</h4>
          <div class="status-list">
            <div class="status-item">
              <div class="status-icon blue">
                <i class="bi bi-lightbulb"></i>
              </div>
              <div class="status-text">
                <span class="lbl">Skills Linked</span>
                <span class="val">{{ profileStore.user?.skills_count ?? 0 }}</span>
              </div>
            </div>
            <div class="status-item">
              <div class="status-icon green">
                <i class="bi bi-building"></i>
              </div>
              <div class="status-text">
                <span class="lbl">Schools Linked</span>
                <span class="val">{{ profileStore.user?.schools_count ?? 0 }}</span>
              </div>
            </div>
            <div class="status-item">
              <div class="status-icon purple">
                <i class="bi bi-journal"></i>
              </div>
              <div class="status-text">
                <span class="lbl">Subjects Linked</span>
                <span class="val">{{ profileStore.user?.subjects_count ?? 0 }}</span>
              </div>
            </div>
          </div>
        </BaseCard>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import BreadcrumbNav from '@/components/ui/BreadcrumbNav.vue'
import BaseCard from '@/components/ui/base/BaseCard.vue'
import BaseModal from '@/components/ui/base/BaseModal.vue'
import BaseSkeleton from '@/components/ui/base/BaseSkeleton.vue'
import BaseInput from '@/components/ui/base/BaseInput.vue'
import BaseSelect from '@/components/ui/base/BaseSelect.vue'
import { useFormValidation, validationRules } from '@/composables/useFormValidation'

const profileStore = useProfileStore()
const toast = useToast()
const confirm = useConfirm()
const activeTab = ref('overview')
const fileInput = ref(null)
const showEditModal = ref(false)

watch(activeTab, (newTab) => {
  if (newTab === 'security') {
    resetPasswordValidation()
    // Optional: clear form values if needed, but keeping them might be desired
    // passwordForm.old_pass = ''
    // passwordForm.new_pass = ''
    // passwordForm.new_pass_confirmation = ''
  }
})

const personalForm = reactive({
  full_name: '',
  phone: '',
  email: '',
  dob: '',
  gender: 0,
  current_city: '',
  home_town: '',
  portfolio_link: ''
})

const {
  errors: personalFormErrors,
  validateField: validatePersonalField,
  validate: validateAllPersonal
} = useFormValidation(personalForm, {
  full_name: [validationRules.required('Full name is required')],
  email: [validationRules.required('Email is required'), validationRules.email()],
  phone: [validationRules.required('Phone number is required')],
  portfolio_link: [validationRules.url('Please enter a valid URL (https://...)')]
})

const passwordForm = reactive({
  old_pass: '',
  new_pass: '',
  new_pass_confirmation: ''
})

const {
  errors: passwordFormErrors,
  validateField: validatePasswordField,
  validate: validateAllPassword,
  reset: resetPasswordValidation
} = useFormValidation(passwordForm, {
  old_pass: [validationRules.required('Current password is required')],
  new_pass: [
    validationRules.required('New password is required'),
    validationRules.minLength(6, 'Password must be at least 6 characters')
  ],
  new_pass_confirmation: [
    validationRules.required('Please confirm your new password'),
    (value) => value === passwordForm.new_pass || 'Passwords do not match'
  ]
})

const breadcrumbs = [
  { label: 'Home', path: '/', icon: 'house' },
  { label: 'Dashboard', path: '/' },
  { label: 'Profile', path: null }
]

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'security', label: 'Security' }
]

onMounted(async () => {
  await profileStore.fetchProfile()
})

const openEditModal = () => {
  const u = profileStore.user
  personalForm.full_name = u?.full_name || ''
  personalForm.phone = u?.phone || ''
  personalForm.email = u?.email || ''
  personalForm.dob = u?.dob || ''
  personalForm.gender = u?.gender || 0
  personalForm.current_city = u?.current_city || ''
  personalForm.home_town = u?.home_town || ''
  personalForm.portfolio_link = u?.portfolio_link || ''
  showEditModal.value = true
}

const savePersonalInfo = async () => {
  if (!validateAllPersonal()) {
    toast.error('Please fix the errors before saving')
    return
  }

  try {
    const payload = { ...personalForm }
    // Clean up empty strings to null
    Object.keys(payload).forEach(key => {
      if (payload[key] === '') payload[key] = null
    })

    await profileStore.updatePersonalInfo(payload)
    showEditModal.value = false
    toast.success('Profile updated successfully!')
  } catch (err) {
    console.error(err)
    toast.error('Failed to update profile info')
  }
}

const updatePassword = async () => {
  if (!validateAllPassword()) {
    toast.error('Please fix the password errors')
    return
  }

  try {
    await profileStore.changePassword(passwordForm)
    passwordForm.old_pass = ''
    passwordForm.new_pass = ''
    passwordForm.new_pass_confirmation = ''
    toast.success('Password updated successfully!')
  } catch (err) {
    console.error(err)
    if (err.response?.status === 422) {
      toast.error(err.response.data.message || 'Incorrect current password')
    } else {
      toast.error('Failed to update password')
    }
  }
}

const triggerUpload = () => {
  fileInput.value.click()
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (file) {
    try {
      await profileStore.uploadAvatar(file)
      toast.success('Avatar updated successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to upload avatar')
    }
  }
}

const removeAvatar = () => {
  confirm.show({
    title: 'Remove Photo?',
    message: 'Are you sure you want to remove your profile photo? This will reset it to the default initials.',
    type: 'danger',
    confirmText: 'Remove Photo',
    onConfirm: async () => {
      try {
        await profileStore.removeAvatar()
        toast.success('Avatar removed successfully!')
      } catch (err) {
        console.error(err)
        toast.error('Failed to remove avatar')
      }
    }
  })
}

const getGenderLabel = (gender) => {
  const labels = {
    0: 'Female',
    1: 'Male',
    2: 'Other'
  }
  return labels[gender] || '-'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatCompactDate = (dateStr) => {
  if (!dateStr) return 'Not available'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const profileFields = () => ([
  { key: 'full_name', label: 'Full name', value: profileStore.user?.full_name },
  { key: 'email', label: 'Email', value: profileStore.user?.email },
  { key: 'phone', label: 'Phone', value: profileStore.user?.phone },
  { key: 'dob', label: 'Date of birth', value: profileStore.user?.dob },
  { key: 'gender', label: 'Gender', value: profileStore.user?.gender },
  { key: 'current_city', label: 'Current city', value: profileStore.user?.current_city },
  { key: 'home_town', label: 'Home town', value: profileStore.user?.home_town },
  { key: 'portfolio_link', label: 'Portfolio', value: profileStore.user?.portfolio_link },
  { key: 'avatar', label: 'Avatar', value: profileStore.user?.avatar },
])

const profileCompletion = computed(() => {
  const fields = profileFields()
  const filled = fields.filter((f) => f.value).length
  return fields.length ? Math.round((filled / fields.length) * 100) : 0
})

const missingFields = computed(() => {
  return profileFields()
    .filter((f) => !f.value)
    .map((f) => f.label)
    .slice(0, 4)
})

const recentUpdates = computed(() => {
  const items = []
  if (profileStore.user?.updated_at) {
    items.push({ title: 'Profile updated', time: formatCompactDate(profileStore.user.updated_at) })
  }
  if (profileStore.user?.avatar) {
    items.push({ title: 'Avatar updated', time: 'Recently' })
  }
  if (profileStore.user?.portfolio_link) {
    items.push({ title: 'Portfolio linked', time: 'Recently' })
  }
  return items.slice(0, 3)
})
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Hero Section */
.profile-hero-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.hero-cover {
  height: 160px;
  background: var(--nav-bg);
  position: relative;
  overflow: hidden;
}

.topographic-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.1;
  background-image:
    linear-gradient(var(--color-text) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-text) 1px, transparent 1px);
  background-size: 20px 20px;
}

[data-theme='dark'] .topographic-pattern {
  opacity: 0.05;
}

.hero-content {
  padding: 0 32px 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: -40px;
}

.profile-identity {
  display: flex;
  align-items: flex-end;
  gap: 24px;
}

.profile-avatar-wrapper {
  position: relative;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  background: #111;
  border: 4px solid var(--nav-surface);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  position: relative;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  font-size: 24px;
}

.profile-avatar:hover .avatar-overlay {
  opacity: 1;
}

.avatar-spinner {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.remove-avatar-btn {
  position: absolute;
  top: 0;
  right: -8px;
  width: 28px;
  height: 28px;
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
  transition: all 0.2s ease;
  z-index: 10;
}

.remove-avatar-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid var(--nav-surface);
}

.status-indicator.active {
  background: #22c55e;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

.identity-text {
  padding-bottom: 8px;
}

.user-name {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.role-badge {
  background: var(--nav-surface);
  border: 1px solid var(--color-border);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-muted);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-muted);
}

.status-active {
  color: #22c55e;
  font-weight: 500;
}

.edit-profile-btn {
  background: #fff;
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-profile-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Stats Grid */
.profile-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-mini-card {
  background: var(--nav-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.stat-icon-wrap.blue {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.stat-icon-wrap.green {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.stat-icon-wrap.purple {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.stat-icon-wrap.orange {
  background: rgba(249, 115, 22, 0.1);
  color: #f97316;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
}

.stat-label {
  font-size: 12px;
  color: var(--color-muted);
}

/* Main Layout */
.profile-main-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  align-items: flex-start;
}

.side-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-tabs {
  display: flex;
  gap: 32px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 24px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 12px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-muted);
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.tab-btn.active {
  color: var(--color-text);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-text);
}

.info-section {
  padding: 24px !important;
}

.section-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 24px;
}

.modal-btn {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-btn.cancel {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.modal-btn.confirm {
  background: var(--color-text);
  color: var(--color-secondary);
}

[data-theme='dark'] .modal-btn.confirm {
  background: var(--color-text);
  color: var(--color-secondary);
}

.modal-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.edit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.edit-grid .full-width {
  grid-column: span 2;
}

@media (max-width: 640px) {
  .edit-grid {
    grid-template-columns: 1fr;
  }
}

.text-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.2s;
}

.text-link:hover {
  text-decoration: underline;
  opacity: 0.8;
}

.icon-box,
.header-icon-box {
  width: 42px;
  height: 42px;
  background: var(--nav-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--color-text);
}

.section-title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
}

.section-title p {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: var(--color-muted);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.custom-input:focus,
.custom-select:focus {
  border-color: #3b82f6;
}

.custom-input:hover,
.custom-select:hover {
  border-color: var(--color-muted);
}

.custom-select {
  cursor: pointer;
}

.static-input {
  background: var(--nav-bg);
  border: 1px solid var(--color-border);
  padding: 12px 16px;
  border-radius: 10px;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
}


/* Sidebar */
.sidebar-info-card {
  padding: 20px !important;
}

.sidebar-title {
  margin: 0 0 20px 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text);
}

.completion-meter {
  width: 100%;
  height: 8px;
  background: var(--nav-bg);
  border-radius: 999px;
  border: 1px solid var(--color-border);
  overflow: hidden;
  margin-bottom: 8px;
}

.completion-bar {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #3b82f6);
  border-radius: 999px;
  transition: width 0.3s ease;
}

.completion-meta {
  font-size: 12px;
  color: var(--color-muted);
  margin-bottom: 12px;
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  background: var(--nav-bg);
  border: 1px solid var(--color-border);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  color: var(--color-text);
}

.chip.success {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.quick-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.status-icon.green {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-icon.blue {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-icon.purple {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.status-text {
  display: flex;
  flex-direction: column;
}

.status-text .lbl {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-muted);
}

.status-text .val {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.activity-mini-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-mini-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.act-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.act-icon.blue {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.act-icon.green {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.act-icon.purple {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.act-content {
  display: flex;
  flex-direction: column;
}

.act-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.act-time {
  font-size: 11px;
  color: var(--color-muted);
}

/* Security & Preferences Tabs Styling */
.security-form,
.preferences-form {
  max-width: 600px;
}

/* Removed .custom-input and .custom-select styles */

.btn-update {
  margin-top: 8px;
  width: auto;
  padding: 10px 24px;
}

.settings-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--nav-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.row-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.row-title {
  font-weight: 600;
  color: var(--color-text);
  font-size: 14px;
}

.row-desc {
  font-size: 12px;
  color: var(--color-muted);
  margin: 0;
}

.action-btn-sm {
  background: var(--nav-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.sessions-list,
.settings-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--nav-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.session-name {
  font-weight: 600;
  color: var(--color-text);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-badge {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 20px;
}

.session-loc {
  font-size: 12px;
  color: var(--color-muted);
}

.revoke-btn {
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

/* Custom Toggle Switch */
.custom-toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.custom-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--nav-surface);
  transition: .4s;
  border-radius: 24px;
  border: 1px solid var(--color-border);
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: var(--color-muted);
  transition: .4s;
  border-radius: 50%;
}

.custom-toggle input:checked+.toggle-slider {
  background-color: var(--color-text);
}

[data-theme='light'] .custom-toggle input:checked+.toggle-slider {
  background-color: var(--color-text);
}

.custom-toggle input:checked+.toggle-slider:before {
  transform: translateX(20px);
  background-color: var(--nav-surface);
}

.mb-4 {
  margin-bottom: 20px;
}

.mt-4 {
  margin-top: 24px;
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1200px) {
  .profile-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {
  .profile-main-layout {
    grid-template-columns: 1fr;
  }

  .side-column {
    order: 2;
  }
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: -60px;
    gap: 20px;
  }

  .profile-identity {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .user-meta {
    justify-content: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: auto;
  }
}
</style>
