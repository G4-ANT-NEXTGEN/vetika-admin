<template>
    <div ref="tooltipWrapper" class="tooltip-wrapper">
        <div class="tooltip-trigger" @mouseenter="show" @mouseleave="hide" @focus="show" @blur="hide" <Teleport
            to="body">
            <Transition name="fade">
                <div v-if="isVisible" class="tooltip" :class="[`tooltip-${position}`, `tooltip-${theme}`]">
                    <div class="tooltip-content">
                        <slot>{{ content }}</slot>
                    </div>
                    <div class="tooltip-arrow"></div>
                </div>
            </Transition>
            </Teleport>
        </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    content: String,
    position: {
        type: String,
        default: 'top',
        validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value),
    },
    theme: {
        type: String,
        default: 'dark',
        validator: (value) => ['dark', 'light'].includes(value),
    },
    triggerIcon: {
        type: String,
        default: 'info-circle',
    },
    delay: {
        type: Number,
        default: 0,
    },
})

const isVisible = ref(false)
const tooltipWrapper = ref(null)
let hideTimeout = null
let showTimeout = null

const show = () => {
    if (hideTimeout) clearTimeout(hideTimeout)

    showTimeout = setTimeout(() => {
        isVisible.value = true
        updatePosition()
    }, props.delay)
}

const hide = () => {
    if (showTimeout) clearTimeout(showTimeout)

    hideTimeout = setTimeout(() => {
        isVisible.value = false
    }, 50)
}

const updatePosition = () => {
    if (!tooltipWrapper.value) return

    const rect = tooltipWrapper.value.getBoundingClientRect()
    const tooltip = document.querySelector('.tooltip')
    if (!tooltip) return

    const offset = 8
    const positions = {
        top: {
            top: rect.top - tooltip.offsetHeight - offset,
            left: rect.left + rect.width / 2 - tooltip.offsetWidth / 2,
        },
        bottom: {
            top: rect.bottom + offset,
            left: rect.left + rect.width / 2 - tooltip.offsetWidth / 2,
        },
        left: {
            top: rect.top + rect.height / 2 - tooltip.offsetHeight / 2,
            left: rect.left - tooltip.offsetWidth - offset,
        },
        right: {
            top: rect.top + rect.height / 2 - tooltip.offsetHeight / 2,
            left: rect.right + offset,
        },
    }

    const pos = positions[props.position]
    tooltip.style.top = `${pos.top}px`
    tooltip.style.left = `${pos.left}px`
}

onMounted(() => {
    window.addEventListener('scroll', updatePosition)
    window.addEventListener('resize', updatePosition)
})

onUnmounted(() => {
    window.removeEventListener('scroll', updatePosition)
    window.removeEventListener('resize', updatePosition)
    if (hideTimeout) clearTimeout(hideTimeout)
    if (showTimeout) clearTimeout(showTimeout)
})
</script>

<style scoped>
.tooltip-wrapper {
    position: relative;
    display: inline-block;
}

.tooltip-trigger {
    cursor: help;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text);
    transition: color 0.15s ease-in-out;
}

.tooltip-trigger:hover {
    color: #0d6efd;
}

.tooltip {
    position: fixed;
    z-index: 10000;
    max-width: 250px;
    padding: 0.625rem 0.875rem;
    border-radius: 6px;
    font-size: 0.85rem;
    line-height: 1.4;
    white-space: normal;
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tooltip-dark {
    background-color: #212529;
    color: #f8f9fa;
    border: 1px solid #495057;
}

.tooltip-light {
    background-color: #f8f9fa;
    color: #212529;
    border: 1px solid #dee2e6;
}

[data-theme='dark'] .tooltip-dark {
    background-color: #2d2d2d;
    color: #e8e8e8;
}

.tooltip-arrow {
    position: absolute;
    width: 6px;
    height: 6px;
    background-color: inherit;
    border: inherit;
}

.tooltip-top .tooltip-arrow {
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
}

.tooltip-bottom .tooltip-arrow {
    top: -4px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
}

.tooltip-left .tooltip-arrow {
    right: -4px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
}

.tooltip-right .tooltip-arrow {
    left: -4px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
