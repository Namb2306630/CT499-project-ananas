<script setup>
import { computed } from 'vue'
import LoadingState from '../common/LoadingState.vue'
import AddCard from '../common/AddCard.vue'
import CardItem from '../common/CardItem.vue'
import ListItem from '../common/ListItem.vue'
const props = defineProps({
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

  countLabel: {
    type: String,
    default: 'Sản phẩm',
  },

  showAddCard: {
    type: Boolean,
    default: true,
  },
  showCardItem: {
    type: Boolean,
    default: true,
  },

  showSidebar: {
    type: Boolean,
    default: true,
  },
  objectFit: {
    type: String,
    default: 'cover',
  },
})

const emit = defineEmits(['add', 'edit', 'delete'])

const columns = computed(() => {
  return [
    ...props.fields.filter((f) => f.type !== 'isActive').map((f) => f.width || '1fr'),
    '120px', // Trạng thái
    '80px', // Thao tác
  ].join(' ')
})
</script>

<template>
  <div class="container-tool">
    <LoadingState v-if="loading || error?.code === 500" :loading="loading" :error="error" />
    <!-- card data -->
    <div
      :class="[
        showCardItem ? 'card-grid' : 'list-container',
        { 'no-sidebar': !showSidebar && showCardItem },
      ]"
    >
      <template v-if="showCardItem">
        <CardItem
          v-for="item in items"
          :key="item._id"
          :item="item"
          :fields="fields"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
          :count-label="countLabel"
          :object-fit="objectFit"
        />
      </template>

      <template v-if="!showCardItem">
        <div class="list-item header" :style="{ gridTemplateColumns: columns }">
          <div
            v-for="field in fields.filter((f) => f.type !== 'isActive')"
            :key="field.name"
            class="cell"
          >
            {{ field.label }}
          </div>

          <div class="cell">Trạng thái</div>
          <div class="cell">Thao tác</div>
        </div>

        <template v-if="items.length">
          <ListItem
            v-for="item in items"
            :key="item._id"
            :item="item"
            :fields="fields"
            @edit="emit('edit', $event)"
            @delete="emit('delete', $event)"
          />
        </template>
        <div v-else class="empty">
          <i class="fa-regular fa-folder-open"></i>
          <h3>Chưa có dữ liệu</h3>
          <p>Hiện tại chưa có dữ liệu nào để hiển thị.</p>
        </div>
      </template>

      <AddCard v-if="showAddCard" :content="content" @click="emit('add')" />
    </div>
  </div>
</template>

<style scoped>
@import '../../assets/css/list-item.css';
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

.list-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
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
