<template>
    <button :class="`btn btn-${variant}`" :type="type" :disabled="isDisabled || isLoading" @click="handleClick">
        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
        <slot></slot>
    </button>
</template>

<script setup>
const props = defineProps({
    variant: { type: String, default: "primary" },
    isLoading: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    type: { type: String, default: "button" },
});

const emit = defineEmits(["click"]);

const handleClick = () => {
    if (!props.isDisabled && !props.isLoading) {
        emit("click");
    }
};
</script>
