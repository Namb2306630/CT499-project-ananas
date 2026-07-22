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
@import '@/assets/css/list-item.css';
</style>
