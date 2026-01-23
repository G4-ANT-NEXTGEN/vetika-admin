<template>
    <div class="form-group">
        <label v-if="label" :for="id" class="form-label">
            {{ label }}
            <span v-if="required" class="required-badge">*</span>
        </label>
        <slot></slot>
        <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>
        <small v-if="hint" class="form-text">{{ hint }}</small>
    </div>
</template>

<script setup>
defineProps({
    label: String,
    id: String,
    error: String,
    hint: String,
    required: { type: Boolean, default: false },
})
</script>

<style scoped>
.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
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

.invalid-feedback {
    color: #dc3545;
    font-size: 0.875rem;
}

.form-text {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: var(--color-muted);
}
</style>
