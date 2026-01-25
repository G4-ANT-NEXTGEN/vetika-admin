<template>
    <BaseCard class="quick-action" role="button" tabindex="0" @click="$emit('click')" @keyup.enter="$emit('click')">
        <div class="icon-wrap">
            <i :class="['bi', icon]"></i>
        </div>
        <div class="content">
            <span class="label">{{ label }}</span>
            <span class="sub">{{ sub }}</span>
        </div>
        <i class="bi bi-chevron-right caret" aria-hidden="true"></i>
    </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/ui/base/BaseCard.vue'

defineProps({
    label: {
        type: String,
        required: true,
    },
    sub: {
        type: String,
        default: '',
    },
    icon: {
        type: String,
        default: 'bi-lightning-charge',
    },
})

defineEmits(['click'])
</script>

<style scoped>
.quick-action {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 12px;
    align-items: center;
    padding: 12px;
    border-radius: 10px;
    border: 1px dashed var(--color-border);
    background: var(--nav-surface);
    cursor: pointer;
    transition: all 0.15s ease;
}

.quick-action:hover {
    border-color: var(--sidebar-hover);
    transform: translateY(-1px);
}

.icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    background: var(--nav-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    font-size: 18px;
}

.content {
    display: grid;
    gap: 4px;
    text-align: left;
}

.label {
    font-weight: 600;
    color: var(--color-text);
}

.sub {
    color: var(--color-muted);
    font-size: 12px;
}

.caret {
    color: var(--color-muted);
    font-size: 14px;
}
</style>
