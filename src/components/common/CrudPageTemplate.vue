<template>
    <div class="crud-page">
        <!-- Page Header -->
        <PageHeader :title="title" :description="description" :breadcrumbs="breadcrumbs"
            :add-button-text="addButtonText" @add="handleAdd" />

        <!-- Search Bar -->
        <div v-if="showSearch" class="search-section">
            <BaseSearch v-model="searchQuery" :placeholder="searchPlaceholder" @search="handleSearch" />
        </div>

        <!-- Table Container -->
        <div class="table-container">
            <!-- Loading State -->
            <LoadingSpinner v-if="isLoading" label="Loading..." />

            <!-- Empty State -->
            <div v-else-if="!items || items.length === 0" class="empty-state">
                <EmptyState icon="inbox" title="No Data" :message="emptyStateMessage"
                    :show-action="showSearch && searchQuery" />
            </div>

            <!-- Data Table -->
            <BaseTable v-else :columns="columns" :items="filteredItems" @edit="handleEdit" @delete="handleDelete">
                <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
                    <slot :name="slotName" v-bind="slotProps" />
                </template>
            </BaseTable>
        </div>

        <!-- Pagination -->
        <div v-if="showPagination && totalPages > 1" class="pagination-section">
            <BasePagination :current-page="currentPage" :total-pages="totalPages" :total-items="totalItems"
                :items-per-page="itemsPerPage" @page-change="handlePageChange" />
        </div>

        <!-- Add/Edit Modal -->
        <BaseModal v-if="showModal" :title="modalTitle" @close="closeModal">
            <slot name="form" :item="editingItem" :close="closeModal"></slot>
        </BaseModal>

        <!-- Detail View Modal -->
        <BaseModal v-if="showDetailModal" :title="detailModalTitle" size="lg" @close="closeDetailModal">
            <slot name="detail" :item="viewingItem" :close="closeDetailModal"></slot>
        </BaseModal>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseSearch from '@/components/ui/BaseSearch.vue'
import BaseTable from '@/components/ui/base/BaseTable.vue'
import BasePagination from '@/components/ui/base/BasePagination.vue'
import BaseModal from '@/components/ui/base/BaseModal.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    description: String,
    breadcrumbs: Array,

    addButtonText: {
        type: String,
        default: 'Add New',
    },

    showSearch: {
        type: Boolean,
        default: true,
    },

    searchPlaceholder: {
        type: String,
        default: 'Search...',
    },
    searchFields: {
        type: Array,
        default: () => ['name'],
    },

    columns: {
        type: Array,
        required: true,
    },
    items: {
        type: Array,
        default: () => [],
    },
    isLoading: {
        type: Boolean,
        default: false,
    },

    showPagination: {
        type: Boolean,
        default: true,
    },
    itemsPerPage: {
        type: Number,
        default: 10,
    },


    modalTitle: {
        type: String,
        default: 'Form',
    },
    detailModalTitle: {
        type: String,
        default: 'Details',
    },


    emptyStateMessage: {
        type: String,
        default: 'No items found. Create one to get started.',
    },
})

const emit = defineEmits(['add', 'edit', 'delete', 'view', 'search'])

// State
const searchQuery = ref('')
const currentPage = ref(1)
const showModal = ref(false)
const showDetailModal = ref(false)
const editingItem = ref(null)
const viewingItem = ref(null)

// Computed
const filteredItems = computed(() => {
    if (!searchQuery.value) {
        return props.items
    }

    return props.items.filter((item) => {
        return props.searchFields.some((field) => {
            const value = item[field]
            return value && value.toString().toLowerCase().includes(searchQuery.value.toLowerCase()
  })
    })

    const totalItems = computed(() => filteredItems.value.length)

    const totalPages = computed(() => {
        return Math.ceil(totalItems.value / props.itemsPerPage)
    })

    const paginatedItems = computed(() => {
        const start = (currentPage.value - 1) * props.itemsPerPage
        const end = start + props.itemsPerPage
        return filteredItems.value.slice(start, end)
    })

    const handleAdd = () => {
        editingItem.value = null
        showModal.value = true
        emit('add')
    }

    const handleEdit = (id) => {
        editingItem.value = props.items.find((item) => item.id === id)
        showModal.value = true
        emit('edit', editingItem.value)
    }

    const handleDelete = (id) => {
        emit('delete', id)
    }

    const handleView = (id) => {
        viewingItem.value = props.items.find((item) => item.id === id)
        showDetailModal.value = true
        emit('view', viewingItem.value)
    }

    const handleSearch = () => {
        currentPage.value = 1
        emit('search', searchQuery.value)
    }

    const closeModal = () => {
        showModal.value = false
        editingItem.value = null
    }

    const closeDetailModal = () => {
        showDetailModal.value = false
        viewingItem.value = null
    }

    const handlePageChange = (page) => {
        currentPage.value = page
    }

    // Expose methods
    defineExpose({
        openModal: () => {
            handleAdd()
        },
        closeModal,
        openDetailModal: (id) => {
            handleView(id)
        },
        closeDetailModal,
    })
</script>

<style scoped>
.crud-page {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.search-section {
    max-width: 400px;
}

.table-container {
    overflow-x: auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.empty-state {
    padding: 3rem 2rem;
}

.pagination-section {
    display: flex;
    justify-content: center;
    padding-top: 1rem;
}

@media (max-width: 768px) {
    .crud-page {
        gap: 1.5rem;
    }

    .search-section {
        max-width: 100%;
    }

    .table-container {
        overflow-x: auto;
    }
}
</style>
