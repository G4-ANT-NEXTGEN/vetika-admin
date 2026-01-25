<template>
    <li class="activity-item">
        <div class="activity-dot"></div>
        <div class="activity-body">
            <div class="activity-top">
                <span class="badge" :class="badgeColor">{{ type }}</span>
                <span class="muted">{{ time }}</span>
            </div>
            <div class="activity-title">{{ title }}</div>
            <div class="activity-meta muted">{{ meta }}</div>
        </div>
        <button class="ghost-icon" type="button" aria-label="More" @click="$emit('action')">
            <i class="bi bi-three-dots"></i>
        </button>
    </li>
</template>

<script setup>
defineProps({
    type: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    meta: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    badgeColor: {
        type: String,
        default: 'badge-blue',
    },
})

defineEmits(['action'])
</script>

<style scoped>
.activity-item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 10px;
    align-items: flex-start;
}

.activity-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #2d8cff;
    margin-top: 6px;
}

.activity-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.activity-top {
    display: flex;
    align-items: center;
    gap: 8px;
}

.badge {
    padding: 4px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2px;
}

.badge-green {
    background: rgba(46, 204, 113, 0.1);
    color: #2ecc71;
}

.badge-blue {
    background: rgba(45, 140, 255, 0.1);
    color: #2d8cff;
}

.badge-red {
    background: rgba(220, 53, 69, 0.1);
    color: #dc3545;
}

.activity-title {
    font-weight: 600;
    color: var(--color-text);
}

.activity-meta {
    font-size: 12px;
}

.muted {
    color: var(--color-muted);
    font-size: 12px;
}

.ghost-icon {
    background: transparent;
    border: none;
    color: var(--color-muted);
    cursor: pointer;
    padding: 4px;
}
</style>
