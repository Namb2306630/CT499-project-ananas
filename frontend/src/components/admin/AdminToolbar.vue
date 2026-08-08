<script setup>
import { computed } from 'vue'
import LoadingState from '../common/LoadingState.vue'
import AddCard from '../common/AddCard.vue'

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
  cardComponent: {
    type: Object,
    default: null,
  },
  listComponent: {
    type: Object,
    default: null,
  },
  headers: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['add', 'edit', 'delete'])

const columns = computed(() => {
  return [...props.headers.map((h) => h.width || '1fr'), '120px', '80px'].join(' ')
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
        <component
          :is="cardComponent"
          v-for="item in items"
          :key="item._id"
          :item="item"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />
      </template>

      <template v-if="!showCardItem">
        <div class="list-scroll">
          <div class="list-wrapper">
            <div class="list-item header" :style="{ gridTemplateColumns: columns }">
              <div v-for="header in headers" :key="header.label" class="cell">
                {{ header.label }}
              </div>
              <div class="cell">Trạng thái</div>
              <div class="cell">Thao tác</div>
            </div>

            <template v-if="items.length">
              <component
                :is="listComponent"
                v-for="item in items"
                :key="item._id"
                :item="item"
                @edit="emit('edit', $event)"
                @delete="emit('delete', $event)"
                :headers="headers"
              />
            </template>

            <div v-else class="empty">
              <i class="fa-regular fa-folder-open"></i>
              <h3>Chưa có dữ liệu</h3>
              <p>Hiện tại chưa có dữ liệu nào để hiển thị.</p>
            </div>
          </div>
        </div>
      </template>

      <AddCard v-if="showAddCard" :content="content" @click="emit('add')" />
    </div>
    <!-- <div v-if="!loading && items.length === 0 && showCardItem" class="empty">
      <i class="fa-regular fa-folder-open"></i>
      <h3>Chưa có dữ liệu</h3>
      <p>Hiện tại chưa có dữ liệu nào để hiển thị.</p>
    </div> -->
  </div>
</template>

<style scoped>
.list-item {
  display: grid;
  gap: 20px;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  transition: 0.2s;
  min-width: 767px;
}

.list-item:hover {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.cell {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 2px 0 2px;
}
.header {
  background: var(--color-9);
  color: white;
  font-weight: 600;
  margin-bottom: 0;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 767px;
  min-height: 220px;
  padding: 40px 20px;

  background: #fff;
  border: 2px dashed #dbe3ec;
  border-radius: 12px;

  color: #64748b;
}

.empty i {
  font-size: 56px;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.empty h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #334155;
}

.empty p {
  margin-top: 8px;
  font-size: 14px;
  color: #94a3b8;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.card-grid.no-sidebar {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.card-grid,
.card-grid.no-sidebar {
  display: grid;
  width: 100%;
  gap: 16px;

  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

.card-grid > * {
  transition:
    transform 0.35s ease,
    width 0.35s ease,
    opacity 0.35s ease;
}
.container-tool {
  width: 100%;
  min-width: 0;
  margin-top: 5px;
}
.list-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
.list-scroll {
  width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.list-scroll::-webkit-scrollbar {
  display: none;
}

.list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;

  padding: 6px 0; /* để box-shadow không sát mép */
}
</style>
