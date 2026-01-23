<template>
    <div class="d-flex justify-content-between align-items-center">
        <div class="text-muted small">
            Showing {{ startItem }}–{{ endItem }} of {{ totalItems }}
        </div>
        <nav aria-label="Page navigation">
            <ul class="pagination mb-0">
                <!-- Previous -->
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                        &laquo;
                    </a>
                </li>
                <li v-for="(item, index) in paginationItems" :key="index" class="page-item" :class="{
                    active: item === currentPage,
                    disabled: item === '...'
                }">
                    <span v-if="item === '...'" class="page-link">…</span>

                    <a v-else class="page-link" href="#" @click.prevent="changePage(item)">
                        {{ item }}
                    </a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                        &raquo;
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    currentPage: {
        type: Number,
        required: true,
    },
    perPage: {
        type: Number,
        required: true,
    },
    totalItems: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits(["update:page"]);

const totalPages = computed(() =>
    Math.ceil(props.totalItems / props.perPage)
);

const startItem = computed(() =>
    (props.currentPage - 1) * props.perPage + 1
);

const endItem = computed(() =>
    Math.min(props.currentPage * props.perPage, props.totalItems)
);

const paginationItems = computed(() => {
    const pages = [];
    const total = totalPages.value;
    const current = props.currentPage;

    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
        return pages;
    }

    pages.push(1);

    if (current > 3) {
        pages.push("...");
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < total - 2) {
        pages.push("...");
    }

    pages.push(total);

    return pages;
});

const changePage = (page) => {
    if (page === "..." || page < 1 || page > totalPages.value) return;
    emit("update:page", page);
};
</script>
