<script setup>
import { computed } from 'vue'
import ListActions from './ListActions.vue'

const props = defineProps({
  item: { type: Object, required: true },
  columns: { type: String, default: 'repeat(auto-fit, minmax(100px, 1fr))' },
  showActions: { type: Boolean, default: true },
})

const emit = defineEmits(['edit', 'delete'])

const handleEdit = () => emit('edit', props.item)
const handleDelete = () => emit('delete', props.item)
</script>

<template>
  <div class="list-item" :style="{ gridTemplateColumns: columns }" @click.stop="handleEdit">
    <!-- Slot chứa toàn bộ các ô dữ liệu (Cells) bên trong -->
    <div class="list-content">
      <slot :item="item" />
    </div>

    <!-- Cột Trạng thái (Nếu cần dùng mặc định) -->
    <div class="list-status">
      <slot name="status" :item="item">
        <span :class="item.isActive ? 'active' : 'inactive'">
          {{ item.isActive ? 'Hoạt động' : 'Ẩn' }}
        </span>
      </slot>
    </div>

    <!-- Cột Thao tác -->
    <ListActions v-if="showActions" @edit="handleEdit" @delete="handleDelete" />
  </div>
</template>

<style scoped>
/* css trong ListItem */
.list-item:hover {
  cursor: pointer;
}
.list-content {
  display: contents;
}
.list-status {
  text-align: start;
}
.active {
  padding: 6px 12px;
  border-radius: 20px;
  background: #d1fae5;
  color: #047857;
  font-weight: 500;
}

.inactive {
  padding: 6px 12px;
  border-radius: 20px;
  background: #fee2e2;
}
</style>
