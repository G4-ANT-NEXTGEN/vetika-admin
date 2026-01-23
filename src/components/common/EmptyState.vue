<template>
    <div class="empty-state">
        <div class="empty-state-icon">
            <i :class="['bi', `bi-${icon}`]"></i>
        </div>
        <h3 class="empty-state-title">{{ title }}</h3>
        <p class="empty-state-message">{{ message }}</p>
        <slot v-if="showAction" name="action"></slot>
    </div>
</template>

<script setup>
defineProps({
    icon: {
        type: String,
        default: 'inbox',
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    showAction: {
        type: Boolean,
        default: false,
    },
})
</script>

<style scoped>
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
}

.empty-state-icon {
    font-size: 3.5rem;
    color: var(--color-muted);
    margin-bottom: 1rem;
}

.empty-state-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 0.5rem 0;
}

.empty-state-message {
    font-size: 0.95rem;
    color: var(--color-muted);
    margin: 0 0 1.5rem 0;
    max-width: 400px;
}
</style>
