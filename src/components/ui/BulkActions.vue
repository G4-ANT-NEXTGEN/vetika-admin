<template>
  <div v-if="hasSelected" class="bulk-actions">
    <div class="bulk-actions-bar">
      <div class="bulk-info">
        <span class="selected-count">{{ selectedCount }} item{{ selectedCount !== 1 ? 's' : '' }}
          selected</span>
      </div>

      <div class="bulk-buttons">
        <slot>
          <BaseButton v-if="showDelete" variant="danger" size="sm" @click="handleDelete">
            <i class="bi bi-trash me-1"></i>
            Delete
          </BaseButton>
          <BaseButton v-if="showExport" variant="secondary" size="sm" @click="$emit('export')">
            <i class="bi bi-download me-1"></i>
            Export
          </BaseButton>
        </slot>

        <BaseButton variant="secondary" size="sm" @click="$emit('clear')" ops=defineProps({ selectedCount: { type:
          Number, required: true, }, hasSelected: { type: Boolean, required: true, }, showDelete: { type: Boolean,
          default: true, }, showExport: { type: Boolean, default: true, }, }) const emit=defineEmits(['delete', 'export'
          , 'clear' ]) const { show: showConfirm }=useConfirm() const handleDelete=async ()=> {
          const confirmed = await showConfirm({
          title: 'Delete Items',
          message: `Are you sure you want to delete ${props.selectedCount} item${props.selectedCount !== 1 ?
          's' : ''}?`,
          type: 'danger',
          })

          if (confirmed) {
          emit('delete')
          }
          }
          </script>

          <style scoped>
            .bulk-actions {
              animation: slideUp 0.2s ease-out;
            }

            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(10px);
              }

              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .bulk-actions-bar {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 1rem;
              padding: 1rem;
              background-color: var(--color-secondary);
              border: 1px solid var(--color-border);
              border-radius: 8px;
              margin-bottom: 1.5rem;
            }

            .bulk-info {
              display: flex;
              align-items: center;
              gap: 1rem;
            }

            .selected-count {
              font-weight: 600;
              color: var(--color-text);
              font-size: 0.95rem;
            }

            .bulk-buttons {
              display: flex;
              gap: 0.5rem;
              align-items: center;
              flex-wrap: wrap;
              justify-content: flex-end;
            }

            @media (max-width: 768px) {
              .bulk-actions-bar {
                flex-direction: column;
                gap: 0.75rem;
              }

              .bulk-info {
                width: 100%;
              }

              .bulk-buttons {
                width: 100%;
                justify-content: space-between;
              }
            }
          </style>
