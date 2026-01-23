<template>
    <div class="base-textarea-wrapper">
        <label v-if="label" :for="id" class="form-label">
            {{ label }}
            <span v-if="required" class="required-badge">*</span>
        </label>
        <textarea :id="id" :value="modelValue" :class="['form-control', { 'is-invalid': error, 'is-valid': isValid }]"
            :placeholder="placeholder" :disabled="disabled" :required="required" :rows="rows" :maxlength="maxlength"
            @input="$emit('update:modelValue', $event.target.value)" @blur="$emit('blur')"></textarea>
        <div v-if="showCharCount" class="char-count">
            {{ modelValue?.length || 0 }} / {{ maxlength }}
        </div>
        <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>
    </div>
</template>

<script setup>
defineProps({
    modelValue: [String, Number],
    label: String,
    placeholder: String,
    id: String,
    rows: { type: Number, default: 4 },
    maxlength: { type: Number, default: 500 },
    showCharCount: { type: Boolean, default: false },
    error: String,
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    isValid: { type: Boolean, default: false },
})

defineEmits(['update:modelValue', 'blur'])
</script>

<style scoped>
.base-textarea-wrapper {
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

.form-control {
    padding: 0.625rem 0.875rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background-color: var(--color-secondary);
    color: var(--color-text);
    font-size: 0.95rem;
    font-family: inherit;
    resize: vertical;
    transition:
        border-color 0.15s ease-in-out,

        border-color 0.15s ease-in-out,
        box-shadow 0.15s ease-in-out;
}

.form-control:hover:not(:disabled) {
    border-color: var(--color-muted);
}

.form-control:focus {
    outline: none;
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    background-color: var(--color-secondary);
    color: var(--color-text);
}

.form-control:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.form-control.is-invalid {
    border-color: #dc3545;
}

.form-control.is-invalid:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

.form-control.is-valid {
    border-color: #198754;
}

.form-control.is-valid:focus {
    border-color: #198754;
    box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
}

.char-count {
    font-size: 0.875rem;
    color: var(--color-muted);
    text-align: right;
}

.invalid-feedback {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}
</style>
