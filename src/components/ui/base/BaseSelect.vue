<template>
    <div class="base-select-wrapper">
        <label v-if="label" :for="id" class="form-label">
            {{ label }}
            <span v-if="required" class="required-badge">*</span>
        </label>
        <select :id="id" :value="modelValue" :class="['form-select', { 'is-invalid': error, 'is-valid': isValid }]"
            :disabled="disabled" :required="required" @change="$emit('update:modelValue', $event.target.value)"
            @blur="$emit('blur')">
            <option v-if="placeholder" value="">{{ placeholder }}</option>
            <option v-for="option in computedOptions" :key="option.value" :value="option.value">
                {{ option.label }}
            </option>
        </select>
        <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: [String, Number],
    label: String,
    placeholder: String,
    id: String,
    options: {
        type: Array,
        default: () => [],
        validator: (value) =>
            value.every(
                (item) =>
                    (typeof item === 'object' && 'value' in item && 'label' in item) ||
                    typeof item === 'string',
            ),
    },
    error: String,
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    isValid: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'blur'])

const computedOptions = computed(() => {
    return props.options.map((option) => {
        if (typeof option === 'string') {
            return { value: option, label: option }
        }
        return option
    })
})
</script>

<style scoped>
.base-select-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-label {
    font-weight: 500;
    color: var(--color-text);
    font-size: 0.95rem;
    margin: 0;
}

.required-badge {
    color: #dc3545;
    margin-left: 0.25rem;
}

.form-select {
    padding: 0.625rem 0.875rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background-color: var(--color-secondary);
    color: var(--color-text);
    font-size: 0.95rem;
    transition:
        border-color 0.15s ease-in-out,
        box-shadow 0.15s ease-in-out;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 16px 12px;
    padding-right: 2.5rem;
}

.form-select:hover:not(:disabled) {
    border-color: var(--color-muted);
}

.form-select:focus {
    outline: none;
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    background-color: var(--color-secondary);
}

.form-select:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.form-select.is-invalid {
    border-color: #dc3545;
    padding-right: calc(1.5em + 0.75rem);
    background-image:
        url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e"),
        url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath fill='%23dc3545' d='M8 3.5a.5.5 0 0 0-1 0V6a.5.5 0 0 0 1 0V3.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545'/%3e%3c/svg%3e");
    background-position:
        right 0.75rem center,
        center right 2.25rem;
    background-size:
        16px 12px,
        calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    background-repeat: no-repeat;
}

.form-select.is-valid {
    border-color: #198754;
}

.invalid-feedback {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

/* Dark mode adjustments */
[data-theme='dark'] .form-select {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ced4da' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
}

[data-theme='dark'] .form-select.is-invalid {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ced4da' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e"),
        url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath fill='%23dc3545' d='M8 3.5a.5.5 0 0 0-1 0V6a.5.5 0 0 0 1 0V3.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545'/%3e%3c/svg%3e");
}

</style>
