<script setup>
const props = defineProps({
  pagination: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['change-page'])

const changePage = (page) => {
  if (page < 1 || page > props.pagination.totalPages || page === props.pagination.page) {
    return
  }

  emit('change-page', page)
}
</script>

<template>
  <div v-if="pagination.totalPages > 1" class="pagination">
    <!-- <div class="pagination"> -->
    <button @click="changePage(pagination.page - 1)" :disabled="!pagination.hasPrev">
      <i class="fa-solid fa-angle-left"></i>
    </button>

    <button
      v-for="page in pagination.totalPages"
      :key="page"
      @click="changePage(page)"
      :class="{ active: page === pagination.page }"
    >
      {{ page }}
    </button>

    <button @click="changePage(pagination.page + 1)" :disabled="!pagination.hasNext">
      <i class="fa-solid fa-angle-right"></i>
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
}

.pagination .active {
  background: var(--color-bule-2);
  color: white;
  border-radius: 5px;
}

.pagination button {
  min-width: 36px;
  height: 36px;
  border-radius: 5px;
  border: 1px solid var(--border-gray-4);
  background: white;
  cursor: pointer;
  transition: 0.2s;
}

.pagination button:hover:not(:disabled):not(.active) {
  background: var(--color-3);
}
</style>
