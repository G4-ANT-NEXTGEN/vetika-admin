<template>
    <div class="toast-container">
        <transition-group name="toast-fade" tag="div">
            <BaseToast v-for="toast in toasts" :key="toast.id" :message="toast.message" :type="toast.type"
                @close="removeToast(toast.id)" />
        </transition-group>
    </div>
</template>

<script setup>
import BaseToast from './base/BaseToast.vue'
import { useToast } from '@/composables/useToast'

const { toasts, remove: removeToast } = useToast()
</script>

<style scoped>
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 2147483647;
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 80vh;
    overflow-y: auto;
    pointer-events: none;
}

.toast-container>* {
    pointer-events: auto;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
    transition: all 0.3s ease;
}

.toast-fade-enter-from {
    transform: translateX(400px);
    opacity: 0;
}

.toast-fade-leave-to {
    transform: translateX(400px);
    opacity: 0;
}

@media (max-width: 640px) {
    .toast-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: calc(100vw - 20px);
    }
}
</style>
