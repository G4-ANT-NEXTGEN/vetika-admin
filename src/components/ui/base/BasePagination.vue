<template>
  <div class="custom-pagination-container">
    <div class="pagination-info">
      Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} entries
    </div>
    <nav aria-label="Page navigation">
      <ul class="pagination-list">
        <!-- Previous -->
        <li v-if="page > 1" class="pagination-item">
          <button class="pagination-link btn-text" @click.prevent="changePage(page - 1)">
            Previous
          </button>
        </li>

        <!-- Page Numbers -->
        <li v-for="(item, index) in paginationItems" :key="index" class="pagination-item" :class="{
          active: item === page,
          dots: item === '...'
        }">
          <span v-if="item === '...'" class="pagination-dots">...</span>
          <button v-else class="pagination-link btn-number" @click.prevent="changePage(item)">
            {{ item }}
          </button>
        </li>

        <!-- Next -->
        <li v-if="page < totalPages" class="pagination-item">
          <button class="pagination-link btn-text" @click.prevent="changePage(page + 1)">
            Next
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  page: {
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
  props.totalItems === 0 ? 0 : (props.page - 1) * props.perPage + 1
);

const endItem = computed(() =>
  Math.min(props.page * props.perPage, props.totalItems)
);

const paginationItems = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = props.page;

  if (total <= 5) { // Show up to 5 pages directly
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

const changePage = (pageNumber) => {
  if (pageNumber === "..." || pageNumber < 1 || pageNumber > totalPages.value) return;
  emit("update:page", pageNumber);
};
</script>

<style scoped>
.custom-pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.pagination-info {
  color: var(--color-muted);
  font-size: 13px;
  font-weight: 400;
}

.pagination-list {
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 8px;
}

.pagination-link {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  min-width: 36px;
}

.pagination-link:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
}

.pagination-item.active .pagination-link {
  background: #fff;
  color: #000;
  border-color: #fff;
}

[data-theme='light'] .pagination-item.active .pagination-link {
  background: #000;
  color: #fff;
  border-color: #000;
}

.pagination-item.disabled .pagination-link {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-text {
  min-width: 80px;
}

.pagination-dots {
  color: var(--color-muted);
  padding: 0 4px;
}

/* Rounded variation matching screenshot */
.btn-number {
  border-radius: 10px;
  height: 36px;
  width: 36px;
}

.btn-text {
  border-radius: 10px;
  height: 36px;
}

@media (max-width: 768px) {
  .custom-pagination-container {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
