<template>
    <table class="table table-hover align-middle border">
        <thead class="table-light">
            <tr>
                <th v-for="col in columns" :key="col.key">
                    {{ col.label }}
                </th>
                <th class="text-center">Actions</th>
            </tr>
        </thead>
        <tbody v-if="isLoading">
            <tr v-for="n in 5" :key="n">
                <td :colspan="columns.length + 1">
                    <div class="placeholder-glow">
                        <span class="placeholder bg-secondary col-12"></span>
                    </div>
                </td>
            </tr>
        </tbody>
        <tbody v-else>
            <tr v-if="!items.length">
                <td :colspan="columns.length + 1" class="text-center py-5">
                    <p class="fw-semibold mb-0">No data found</p>
                </td>
            </tr>

            <tr v-for="item in items" :key="item.id">
                <td v-for="col in columns" :key="col.key">
                    <slot :name="`column-${col.key}`" :item="item">
                        {{ item[col.key] }}
                    </slot>
                </td>

                <td class="text-center w-25">
                    <button class="btn btn-sm btn-outline-secondary me-2" @click="$emit('edit', item.id)">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="$emit('delete', item.id)">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
defineProps({
    columns: Array,
    items: Array,
    isLoading: Boolean,
})

defineEmits(['edit', 'delete'])
</script>
