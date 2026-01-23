<template>
    <div class="form-check">
        <input :id="id" type="checkbox" class="form-check-input" :checked="modelValue" :disabled="disabled"
            @change="$emit('update:modelValue', $event.target.checked)" />
        <label v-if="label" :for="id" class="form-check-label">
            {{ label }}
            <span v-if="required" class="required-badge">*</span>
        </label>
    </div>
</template>

<script setup>
defineProps({
    modelValue: { type: Boolean, default: false },
    label: String,
    id: String,
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.form-check {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.form-check-input {
    width: 1.25em;
    height: 1.25em;
    margin-top: 0;
    cursor: pointer;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background-color: var(--color-secondary);
    color: var(--color-text);
    accent-color: #0d6efd;
    transition:
        border-color 0.15s ease-in-out,

        border-color 0.15s ease-in-out,
        box-shadow 0.15s ease-in-out;
    appearance: none;
}

.form-check-input:hover:not(:disabled) {
    border-color: var(--color-muted);
}

.form-check-input:checked {
    background-color: #0d6efd;
    border-color: #0d6efd;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
}

.form-check-input:checked:hover {
    border-color: #0b5ed7;
    background-color: #0b5ed7;
}

.form-check-input:focus {
    outline: none;
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.form-check-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.form-check-label {
    margin: 0;
    font-weight: 500;
    color: var(--color-text);
    cursor: pointer;
    user-select: none;
    font-size: 0.95rem;
}

.required-badge {
    color: #dc3545;
    margin-left: 0.25rem;
}
</style>
