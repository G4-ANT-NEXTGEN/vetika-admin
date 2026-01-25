<template>
    <BaseCard class="stat-card">
        <template v-if="isLoading">
            <div class="stat-top">
                <BaseSkeleton type="rect" width="38px" height="38px" borderRadius="10px" />
                <BaseSkeleton type="rect" width="50px" height="18px" borderRadius="4px" />
            </div>
            <BaseSkeleton type="rect" width="60%" height="28px" borderRadius="4px" style="margin-top: 8px" />
            <BaseSkeleton type="rect" width="40%" height="16px" borderRadius="4px" style="margin-top: 4px" />
        </template>
        <template v-else>
            <div class="stat-top">
                <span class="stat-icon" :class="iconColor">
                    <i :class="['bi', icon]"></i>
                </span>
                <span v-if="change !== null && change !== undefined" class="stat-change" :class="changeDirection">
                    <i :class="changeDirection === 'up' ? 'bi bi-graph-up' : 'bi bi-graph-down'" aria-hidden="true"></i>
                    {{ formattedChange }}%
                </span>
            </div>
            <h3 class="stat-value">{{ value }}</h3>
            <p class="stat-label">{{ label }}</p>
        </template>
    </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '@/components/ui/base/BaseCard.vue'
import BaseSkeleton from '@/components/ui/base/BaseSkeleton.vue'

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    value: {
        type: [String, Number],
        required: true,
    },
    change: {
        type: Number,
        default: null,
    },
    icon: {
        type: String,
        default: 'bi-bar-chart',
    },
    iconColor: {
        type: String,
        default: 'blue',
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
})

const changeDirection = computed(() => {
    if (props.change === null || props.change === undefined) return null
    return props.change >= 0 ? 'up' : 'down'
})

const formattedChange = computed(() => {
    if (props.change === null || props.change === undefined) return ''
    const absolute = Math.abs(props.change)
    return Number.isInteger(absolute) ? absolute : absolute.toFixed(1)
})
</script>

<style scoped>
.stat-card {
    padding: 16px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.stat-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.stat-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    color: #fff;
    font-size: 18px;
}

.stat-icon.purple {
    background: rgba(168, 85, 247, 0.15);
    color: #a855f7;
}

.stat-icon.blue {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
}

.stat-icon.green {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
}

.stat-icon.yellow {
    background: rgba(234, 179, 8, 0.15);
    color: #eab308;
}

.stat-change {
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.stat-change.up {
    color: #2ecc71;
}

.stat-change.down {
    color: #dc3545;
}

.stat-value {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: var(--color-text);
}

.stat-label {
    margin: 0;
    color: var(--color-muted);
    font-size: 12px;
}
</style>
