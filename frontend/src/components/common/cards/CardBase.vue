<script setup>
const props = defineProps({
  item: { type: Object, required: true },
})

const emit = defineEmits(['edit', 'delete'])

const handleEdit = () => {
  if (props.item.status === 'discontinued') return
  emit('edit', props.item)
}
const handleDelete = () => emit('delete', props.item)
</script>

<template>
  <div
    class="card-item"
    :class="{ 'discontinued-card': item.status === 'discontinued' }"
    @click.stop="handleEdit"
  >
    <!-- Slot cho phần Hình ảnh -->
    <div class="card-image">
      <slot name="image" />
    </div>

    <!-- Slot cho Nội dung chính -->
    <div class="card-content">
      <slot name="content" />
    </div>

    <!-- Các nút thao tác cố định -->
    <div v-if="item.status !== 'discontinued'" class="card-actions">
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

.card-item.discontinued-card:hover {
  transform: none;
  box-shadow: none;
  cursor: default;
}

.card-content > * {
  padding: 0 10px;
  margin-bottom: 10px;
} /* action */
.card-actions {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transform: translateY(-10px);
  transition: 0.3s ease;
}

.card-item:hover .card-actions {
  opacity: 1;
  transform: translateY(0);
}

.card-actions button {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--text-white);
  display: flex;
  align-items: center;
  justify-content: center;
}
.edit {
  background: var(--bg-active);
}

.delete {
  background: var(--bg-color-red);
}

.card-item {
  position: relative;
  border: 1px solid var(--border-gray-3);
  width: 100%;
  min-width: 260px;
  max-width: none;
  min-height: 370px;
  margin-top: 10px;
  padding-bottom: 20px;
  margin-bottom: 10px;
  border-radius: 10px;
  overflow: hidden; /* cắt ảnh theo border */
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.card-item:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-black-2);
  cursor: pointer;
}
</style>
