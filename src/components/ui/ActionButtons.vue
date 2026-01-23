<template>
    <div class="action-buttons">
        <button v-if="showView" type="button" class="action-btn view-btn" title="View" @click="$emit('view')">
            <i class="bi bi-eye"></i>
        </button>
        <button v-if="showEdit" type="button" class="action-btn edit-btn" title="Edit" @click="$emit('edit')">
            <i class="bi bi-pencil"></i>
        </button>
        <button v-if="showDelete" type="button" class="action-btn delete-btn" title="Delete" @click="$emit('delete')">
            <i class="bi bi-trash"></i>
        </button>
        <slot></slot>
    </div>
</template>

<script setup>
defineProps({
    showView: {
        type: Boolean,
        default: true,
    },
    showEdit: {
        type: Boolean,
        default: true,
    },
    showDelete: {
        type: Boolean,
        default: true,
    },
})

defineEmits(['view', 'edit', 'delete'])
</script>

<style scoped>
.action-buttons {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background-color: var(--color-secondary);
    color: var(--color-text);
    cursor: pointer;
    font-size: 0.95rem;
    transition: all 0.15s ease-in-out;
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.view-btn:hover {
    border-color: #0d6efd;
    color: #0d6efd;
    background-color: rgba(13, 110, 253, 0.05);
}

.edit-btn:hover {
    border-color: #198754;
    color: #198754;
    background-color: rgba(25, 135, 84, 0.05);
}

.delete-btn:hover {
    border-color: #dc3545;
    color: #dc3545;
    background-color: rgba(220, 53, 69, 0.05);
}

.action-btn:focus {
    outline: none;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
