<script setup>
defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="list-actions">
    <button class="edit" title="Sửa" @click.stop="$emit('edit')">
      <i class="fa-solid fa-pen"></i>
    </button>

    <button class="delete" title="Xóa" @click.stop="$emit('delete')">
      <i class="fa-solid fa-trash"></i>
    </button>
  </div>
</template>

<style scoped>
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
