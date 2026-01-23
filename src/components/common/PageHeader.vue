<template>
    <div class="page-header">
        <div class="header-content">
            <div class="header-left">
                <h1 class="page-title">{{ title }}</h1>
                <nav v-if="breadcrumbs && breadcrumbs.length" class="breadcrumbs">
                    <router-link v-for="(crumb, index) in breadcrumbs" :key="index" :to="crumb.path"
                        :class="{ active: index === breadcrumbs.length - 1 }">
                        {{ crumb.label }}
                    </router-link>
                </nav>
            </div>
            <div class="header-right">
                <slot name="actions">
                    <BaseButton v-if="showAddButton && !hideAddButton" variant="primary" @click="$emit('add')">
                        <i class="bi bi-plus-lg me-2"></i>
                        {{ addButtonText }}
                    </BaseButton>
                </slot>
            </div>
        </div>
        <div v-if="description" class="header-description">
            {{ description }}
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
    description: String,
    breadcrumbs: Array,
    showAddButton: {
        type: Boolean,
        default: true,
    },
    hideAddButton: {
        type: Boolean,
        default: false,
    },
    addButtonText: {
        type: String,
        default: 'Add New',
    },
})

defineEmits(['add'])
</script>

<script>
import BaseButton from '@/components/ui/base/BaseButton.vue'
export default {
    components: {
        BaseButton,
    },
}
</script>

<style scoped>
.page-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--color-border);
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
}

.header-left {
    flex: 1;
}

.page-title {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
}

.breadcrumbs {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
    font-size: 0.875rem;
}

.breadcrumbs a {
    color: #0d6efd;
    text-decoration: none;
    transition: color 0.15s ease-in-out;
}

.breadcrumbs a:hover {
    color: #0b5ed7;
}

.breadcrumbs a.active {
    color: var(--color-muted);
    cursor: default;
    pointer-events: none;
}

.breadcrumbs a:not(:last-child)::after {
    content: '/';
    margin-left: 0.5rem;
    color: var(--color-muted);
}

.header-right {
    flex-shrink: 0;
}

.header-description {
    margin-top: 0.75rem;
    color: var(--color-muted);
    font-size: 0.95rem;
    line-height: 1.5;
}

@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        gap: 1rem;
    }

    .page-title {
        font-size: 1.5rem;
    }

    .header-right {
        width: 100%;
    }
}
</style>
