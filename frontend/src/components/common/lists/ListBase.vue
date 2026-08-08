<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  columns: { type: String, default: 'repeat(auto-fit, minmax(100px, 1fr))' },
  showActions: { type: Boolean, default: true },
})

const emit = defineEmits(['edit', 'delete'])

const handleEdit = () => {
  if (props.item.status === 'discontinued') return
  emit('edit', props.item)
}

const handleDelete = () => {
  if (props.item.status === 'discontinued') return
  emit('delete', props.item)
}
</script>

<template>
  <div
    class="list-item"
    :class="{ 'discontinued-card': item.status === 'discontinued' }"
    :style="{ gridTemplateColumns: columns }"
    @click.stop="handleEdit"
  >
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
    <div v-if="showActions && item.status !== 'discontinued'" class="list-actions">
      <button class="edit" title="Sửa" @click.stop="handleEdit">
        <i class="fa-solid fa-pen"></i>
      </button>

      <button class="delete" title="Xóa" @click.stop="handleDelete">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.card-item.discontinued-card {
  opacity: 0.75;
  filter: grayscale(100%);
  background: var(--color-22);
  border: 2px dashed var(--color-7);
}

.card-item.discondiscontinued-cardtinued:hover {
  transform: none;
  box-shadow: none;
  cursor: default;
}

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
.list-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.list-actions button {
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
}
.edit {
  background: #2563eb;
}

.delete {
  background: #dc2626;
}
</style>
