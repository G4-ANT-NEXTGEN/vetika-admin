<template>
    <div class="base-input-group">
        <label v-if="props.label" :for="props.id" class="form-label">
            {{ props.label }}
            <span v-if="props.required" class="text-danger">*</span>
        </label>
        <div class="input-wrapper" :class="{ 'has-icon': props.icon }">
            <i v-if="props.icon" :class="['input-icon', props.icon]"></i>
            <input
                ref="inputRef"
                :id="props.id"
                :type="inputType"
                :value="props.modelValue"
                :placeholder="props.placeholder"
                :class="['form-control', { 'is-invalid': props.error, 'with-icon': props.icon }]"
                :disabled="props.disabled"
                :required="props.required"
                :autocomplete="props.autocomplete"
                @input="$emit('update:modelValue', $event.target.value)"
                @blur="handleBlur"
            />
            <button
                v-if="props.type === 'password'"
                type="button"
                class="password-toggle"
                @click="togglePassword"
                tabindex="-1"
            >
                <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
            </button>
        </div>
        <div v-if="props.error" class="invalid-feedback d-block">{{ props.error }}</div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    modelValue: [String, Number],
    label: String,
    placeholder: String,
    id: String,
    type: { type: String, default: "text" },
    icon: String,
    error: String,
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    autocomplete: String
});

const emit = defineEmits(["update:modelValue", "blur"]);

const showPassword = ref(false)
const inputType = computed(() => {
    if (props.type === 'password') {
        return showPassword.value ? 'text' : 'password'
    }
    return props.type
})

const togglePassword = () => {
    showPassword.value = !showPassword.value
}

const handleBlur = (event) => {
    emit('update:modelValue', event.target.value)
    emit('blur', event)
}
</script>

<style scoped>
.base-input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
}

.form-label {
    font-weight: 600;
    font-size: 0.875rem;
    margin: 0;
    color: var(--color-text);
}

.text-danger {
    color: #dc3545;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 1rem;
    color: var(--color-muted);
    pointer-events: none;
    z-index: 10;
}

.form-control {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background-color: var(--nav-surface);
    color: var(--color-text);
    font-size: 0.95rem;
    transition: all 0.2s ease-in-out;
}

.form-control.with-icon {
    padding-left: 2.5rem;
}

.form-control:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.form-control.is-invalid {
    border-color: #dc3545;
}

.form-control:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--nav-bg);
}

.invalid-feedback {
    font-size: 0.8rem;
    color: #dc3545;
}

.password-toggle {
    position: absolute;
    right: 1rem;
    background: none;
    border: none;
    color: var(--color-muted);
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
}

.password-toggle:hover {
    color: var(--color-text);
}
</style>
