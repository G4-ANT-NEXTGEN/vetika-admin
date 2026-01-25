<template>
    <teleport to="body">
        <div v-if="isVisible" class="confirm-overlay" @click.self="handleCancel">
            <div class="confirm-dialog">
                <div class="confirm-header">
                    <div class="confirm-icon-wrapper">
                        <i :class="['bi', dialogIcon, 'confirm-icon']"></i>
                    </div>
                </div>

                <div class="confirm-body">
                    <h5 class="confirm-title">{{ title }}</h5>
                    <p class="confirm-message">{{ message }}</p>

                    <div v-if="$slots.default" class="confirm-content">
                        <slot />
                    </div>
                </div>

                <div class="confirm-footer">
                    <button type="button" class="btn btn-outline-secondary" @click="handleCancel">
                        {{ cancelText }}
                    </button>
                    <button type="button" :class="['btn', buttonClass]" :disabled="isLoading" @click="handleConfirm">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                        {{ confirmText }}
                    </button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useConfirm } from '@/composables/useConfirm'

const { confirmState, confirm, cancel } = useConfirm()

const isLoading = ref(false)

const isVisible = computed(() => confirmState.isVisible)
const title = computed(() => confirmState.title)
const message = computed(() => confirmState.message)
const confirmText = computed(() => confirmState.confirmText)
const cancelText = computed(() => confirmState.cancelText)
const type = computed(() => confirmState.type)

const dialogIcon = computed(() => {
    const icons = {
        warning: 'bi-exclamation-triangle-fill',
        danger: 'bi-exclamation-circle-fill',
        info: 'bi-info-circle-fill',
    }
    return icons[type.value] || icons.warning
})

const buttonClass = computed(() => {
    const classes = {
        warning: 'btn-warning',
        danger: 'btn-danger',
        info: 'btn-info',
    }
    return classes[type.value] || classes.warning
})

const handleConfirm = async () => {
    isLoading.value = true
    try {
        await confirm()
    } finally {
        isLoading.value = false
    }
}

const handleCancel = () => {
    cancel()
}
</script>

<style scoped>
.confirm-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9998;
    animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.confirm-dialog {
    background: var(--color-secondary);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    max-width: 500px;
    width: 90%;
    padding: 0;
    overflow: hidden;
    animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
    from {
        transform: translateY(50px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.confirm-header {
    padding: 2rem 1.5rem 1rem;
    text-align: center;
    background: var(--color-accent);
    border-bottom: 1px solid var(--color-border);
}

.confirm-icon-wrapper {
    display: inline-block;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
}

.confirm-header .confirm-icon-wrapper {
    background-color: var(--color-primary);
    opacity: 0.2;
    color: var(--color-primary);
}

.confirm-overlay :deep(.btn-danger)~.confirm-icon-wrapper {
    background-color: var(--color-danger);
    opacity: 0.2;
    color: var(--color-danger);
}

.confirm-overlay :deep(.btn-info)~.confirm-icon-wrapper {
    background-color: var(--color-primary);
    opacity: 0.2;
    color: var(--color-primary);
}

.confirm-body {
    padding: 1.5rem;
    text-align: center;
}

.confirm-title {
    margin: 0 0 0.5rem;
    font-weight: 600;
    color: var(--color-text);
    font-size: 1.25rem;
}

.confirm-message {
    margin: 0;
    color: var(--color-muted);
    font-size: 0.95rem;
    line-height: 1.5;
}

.confirm-content {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
}

.confirm-footer {
    padding: 1.5rem;
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    border-top: 1px solid var(--color-border);
}

.confirm-footer .btn {
    min-width: 100px;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
}

.btn-danger {
    background-color: var(--color-danger);
    border-color: var(--color-danger);
    color: #fff;
}

.btn-info {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    color: #fff;
}

.btn-warning {
    background-color: #eab308;
    border-color: #eab308;
    color: #fff;
}

.confirm-footer .btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

@media (max-width: 480px) {
    .confirm-dialog {
        width: 95%;
    }

    .confirm-header {
        padding: 1.5rem 1rem 0.75rem;
    }

    .confirm-body {
        padding: 1rem;
    }

    .confirm-footer {
        padding: 1rem;
        flex-direction: column;
    }

    .confirm-footer .btn {
        width: 100%;
    }
}
</style>
