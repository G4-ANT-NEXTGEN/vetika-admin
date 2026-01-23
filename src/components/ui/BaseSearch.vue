<template>
    <div class="base-search">
        <div class="search-input-wrapper">
            <i class="bi bi-search search-icon"></i>
            <input :value="modelValue" type="text" class="search-input" :placeholder="placeholder"
                @input="$emit('update:modelValue', $event.target.value)" @keydown.enter="$emit('search')" />
            <button v-if="modelValue && showClear" type="button" class="clear-btn" title="Clear search"
                @click="$emit('update:modelValue', '')">
                <i class="bi bi-x-circle"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    placeholder: {
        type: String,
        default: 'Search...',
    },
    showClear: {
        type: Boolean,
        default: true,
    },
})

defineEmits(['update:modelValue', 'search'])
</script>

<style scoped>
.base-search {
    width: 100%;
}

.search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 0.875rem;
    color: var(--color-muted);
    pointer-events: none;
}

.search-input {
    width: 100%;
    padding: 0.625rem 0.875rem 0.625rem 2.5rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background-color: var(--color-secondary);
    color: var(--color-text);
    font-size: 0.95rem;
    transition:
        border-color 0.15s ease-in-out,

        border-color 0.15s ease-in-out,
        box-shadow 0.15s ease-in-out;
}

.search-input::placeholder {
    color: var(--color-muted);
}

.search-input:hover:not(:disabled) {
    border-color: var(--color-muted);
}

.search-input:focus {
    outline: none;
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    background-color: var(--color-secondary);
    color: var(--color-text);
}

.clear-btn {
    position: absolute;
    right: 0.875rem;
    background: none;
    border: none;
    color: var(--color-muted);
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    transition: color 0.15s ease-in-out;
}

.clear-btn:hover {
    color: var(--color-text);
}

.clear-btn:focus {
    outline: none;
    color: #0d6efd;
}
</style>
