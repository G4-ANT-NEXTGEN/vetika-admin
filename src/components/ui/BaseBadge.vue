<template>
    <span :class="['badge', `badge-${variant}`, `badge-${size}`]">
        <i v-if="icon" :class="['bi', `bi-${icon}`, 'me-1']"></i>
        {{ label }}
    </span>
</template>

<script setup>
defineProps({
    label: {
        type: String,
        required: true,
    },
    variant: {
        type: String,
        default: 'secondary',
        validator: (value) =>
            ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].includes(
                value
            ),
    },
    size: {
        type: String,
        default: 'md',
        validator: (value) => ['sm', 'md', 'lg'].includes(value),
    },
    icon: String,
})
</script>

<style scoped>
.badge {
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    white-space: nowrap;
    transition: all 0.15s ease-in-out;
}

/* Sizes */
.badge-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}

.badge-lg {
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
}

/* Variants */
.badge-primary {
    background-color: #0d6efd;
    color: white;
}

.badge-secondary {
    background-color: #6c757d;
    color: white;
}

.badge-success {
    background-color: #198754;
    color: white;
}

.badge-danger {
    background-color: #dc3545;
    color: white;
}

.badge-warning {
    background-color: #ffc107;
    color: #000;
}

.badge-info {
    background-color: #0dcaf0;
    color: #000;
}

.badge-light {
    background-color: #f8f9fa;
    color: #000;
    border: 1px solid #dee2e6;
}

.badge-dark {
    background-color: #212529;
    color: white;
}

/* Dark mode */
[data-theme='dark'] .badge-light {
    background-color: #212529;
    color: #f8f9fa;
    border-color: #495057;
}

[data-theme='dark'] .badge-dark {
    background-color: #f8f9fa;
    color: #212529;
}
</style>
