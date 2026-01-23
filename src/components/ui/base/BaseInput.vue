<template>
    <label v-if="props.label" :for="props.id" class="form-label">{{ props.label }}</label>
    <input :id="props.id" :type="props.type" :value="props.modelValue" :placeholder="props.placeholder"
        :class="['form-control', { 'is-invalid': props.error }]" :disabled="props.disabled" :required="props.required"
        @input="$emit('update:modelValue', $event.target.value)" @blur="$emit('blur')" />
    <div v-if="props.error" class="invalid-feedback">{{ props.error }}</div>
</template>

<script setup>
const props = defineProps({
    modelValue: [String, Number],
    label: String,
    placeholder: String,
    id: String,
    type: { type: String, default: "text" },
    error: String,
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "blur"]);
</script>
