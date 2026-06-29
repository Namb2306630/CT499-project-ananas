<script setup>
import LoadingState from '../common/LoadingState.vue'
import AddCard from './AddCard.vue'
import CardItem from './CardItem.vue'

defineProps({
  content: String,

  items: {
    type: Array,
    default: () => [],
  },

  loading: Boolean,

  error: {
    type: [String, Object],
    default: null,
  },

  fields: {
    type: Array,
    default: () => [],
  },

  showAddCard: {
    type: Boolean,
    default: true,
  },

  showSidebar: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['add', 'edit', 'delete'])
</script>

<template>
  <div class="container-tool">
    <LoadingState v-if="loading || error.code === 500" :loading="loading" :error="error" />
    <!-- card data -->
    <div class="card-grid" :class="{ 'no-sidebar': !showSidebar }">
      <CardItem
        v-for="item in items"
        :key="item._id"
        :item="item"
        :fields="fields"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />

      <AddCard v-if="showAddCard" :content="content" @click="emit('add')" />
    </div>
  </div>
</template>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  transition: grid-template-columns 0.4s ease;
}

.card-grid.no-sidebar {
  grid-template-columns: repeat(5, 1fr);
}

.card-grid > * {
  transition:
    transform 0.35s ease,
    width 0.35s ease,
    opacity 0.35s ease;
}
.container-tool {
  margin-top: 10px;
}

@media (max-width: 1024px) {
  .card-grid,
  .card-grid.no-sidebar {
    grid-template-columns: repeat(2, 1fr); /* Hiển thị 2 card 1 hàng */
  }
}

@media (max-width: 767px) {
  .card-grid,
  .card-grid.no-sidebar {
    grid-template-columns: repeat(1, 1fr);
  }
}
@media (min-width: 1440px) {
  .card-grid,
  .card-grid.no-sidebar {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (min-width: 1940px) {
  .card-grid,
  .card-grid.no-sidebar {
    grid-template-columns: repeat(8, 1fr);
  }
}
</style>
