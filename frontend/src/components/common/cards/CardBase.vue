<script setup>
const props = defineProps({
  item: { type: Object, required: true },
})

const emit = defineEmits(['edit', 'delete'])

const handleEdit = () => emit('edit', props.item)
const handleDelete = () => emit('delete', props.item)
</script>

<template>
  <div class="card-item" @click.stop="handleEdit">
    <!-- Slot cho phần Hình ảnh -->
    <div class="card-image">
      <slot name="image" />
    </div>

    <!-- Slot cho Nội dung chính -->
    <div class="card-content">
      <slot name="content" />
    </div>

    <!-- Các nút thao tác cố định -->
    <div class="card-actions">
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
@import '@/assets/css/card.css';
</style>
