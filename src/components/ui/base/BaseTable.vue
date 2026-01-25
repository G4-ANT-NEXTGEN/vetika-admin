<template>
  <div class="base-table-container">
    <table class="base-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" :style="{ width: col.width || 'auto' }">
            {{ col.label }}
          </th>
          <th class="actions-header">Actions</th>
        </tr>
      </thead>

      <tbody v-if="isLoading">
        <tr v-for="n in 5" :key="n">
          <td :colspan="columns.length + 1" class="skeleton-row">
            <BaseSkeleton height="20px" width="100%" />
          </td>
        </tr>
      </tbody>

      <tbody v-else>
        <tr v-if="!items || !items.length">
          <td :colspan="columns.length + 1" class="empty-row text-center">
            No data available
          </td>
        </tr>

        <tr v-for="item in items" :key="item.id">
          <td v-for="col in columns" :key="col.key">
            <slot :name="`column-${col.key}`" :item="item">
              {{ item[col.key] }}
            </slot>
          </td>

          <!-- Standardized Actions Column -->
          <td class="actions-cell">
            <div class="action-group">
              <button class="action-btn view" @click="$emit('view', item)" title="View Details">
                <i class="bi bi-eye"></i>
              </button>
              <button class="action-btn edit" @click="$emit('edit', item)" title="Edit Item">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="action-btn delete" @click="$emit('delete', item)" title="Delete Item">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import BaseSkeleton from './BaseSkeleton.vue'

defineProps({
  columns: {
    type: Array,
    required: true // Format: [{ key: 'id', label: 'ID', width: '80px' }]
  },
  items: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['view', 'edit', 'delete'])
</script>

<style scoped>
.base-table-container {
  width: 100%;
  overflow-x: auto;
}

.base-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.base-table th {
  padding: 16px 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-muted);
  border-bottom: 1px solid var(--color-border);
  text-transform: none;
  background: transparent;
}

.base-table td {
  padding: 18px 12px;
  font-size: 14px;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
  vertical-align: middle;
}

.base-table tr:hover td {
  background-color: var(--color-hover);
}

.actions-header {
  text-align: right;
  padding-right: 20px !important;
}

.actions-cell {
  text-align: right;
  padding-right: 12px !important;
}

.action-group {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
}

.action-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  font-size: 17px;
  color: var(--color-muted);
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  color: var(--color-text);
}

.action-btn.delete:hover {
  color: #ff4d4f;
}

.skeleton-row {
  padding: 20px 12px !important;
}

.empty-row {
  padding: 60px !important;
  color: var(--color-muted);
  font-weight: 500;
}

/* Transitions */
.base-table tr {
  transition: background-color 0.15s ease;
}
</style>
