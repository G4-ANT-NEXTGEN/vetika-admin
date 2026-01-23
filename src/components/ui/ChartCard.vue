<template>
    <BaseCard class="chart-card">
        <template #header>
            <div class="chart-header">
                <h3 class="chart-title">{{ title }}</h3>
                <div class="chart-actions">
                    <button v-if="showExport" type="button" class="chart-action-btn" title="Export chart"
                        @click="$emit('export')">
                        <i class="bi bi-download"></i>
                    </button>
                    <button v-if="showRefresh" type="button" class="chart-action-btn"
                        :class="{ refreshing: isRefreshing }" title="Refresh data" @click="$emit('refresh')">
                        <i class="bi bi-arrow-clockwise"></i>
                    </button>
                </div>
            </div>
        </template>

        <div v-if="isLoading" class="chart-loading">
            <LoadingSpinner size="sm" label="Loading..." />
        </div>

        <div v-else-if="!data || (Array.isArray(data) && data.length === 0)" class="chart-empty">
            <EmptyState icon="bar-chart" title="No Data" message="No data available for this chart" />
        </div>

        <div v-else class="chart-container">
            <slot name="default" :data="data">
                <!-- Default slot for chart library integration -->
                <canvas ref="chartCanvas"></canvas>
            </slot>
        </div>

        <div v-if="description" class="chart-footer">
            <small>{{ description }}</small>
        </div>
    </BaseCard>
</template>

<script setup>
import { ref } from 'vue'
import BaseCard from '@/components/ui/base/BaseCard.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'

defineProps({
    title: {
        type: String,
        required: true,
    },
    data: {
        type: [Array, Object],
        default: null,
    },
    description: String,
    isLoading: {
        type: Boolean,
        default: false,
    },
    showExport: {
        type: Boolean,
        default: true,
    },
    showRefresh: {
        type: Boolean,
        default: true,
    },
})

const emit = defineEmits(['export', 'refresh'])

const chartCanvas = ref(null)
const isRefreshing = ref(false)

const handleRefresh = async () => {
    isRefreshing.value = true
    await new Promise((resolve) => setTimeout(resolve, 500))
    emit('refresh')
    isRefreshing.value = false
}
</script>

<style scoped>
.chart-card {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border);
}

.chart-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text);
}

.chart-actions {
    display: flex;
    gap: 0.5rem;
}

.chart-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background-color: var(--color-secondary);
    color: var(--color-text);
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.15s ease-in-out;
}

.chart-action-btn:hover {
    border-color: #0d6efd;
    color: #0d6efd;
    background-color: rgba(13, 110, 253, 0.05);
}

.chart-action-btn.refreshing {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.chart-loading,
.chart-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
}

.chart-container {
    position: relative;
    flex-grow: 1;
    min-height: 300px;
}

.chart-footer {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
    color: var(--color-muted);
    font-size: 0.85rem;
    line-height: 1.5;
}
</style>
